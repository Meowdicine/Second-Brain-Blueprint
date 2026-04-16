param(
  [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$logPath = Join-Path $RepoRoot ".auto-commit.log"
$gitMetaPath = Join-Path $RepoRoot ".git"

function Write-AutoCommitLog {
  param(
    [string]$Level,
    [string]$Message
  )

  $timestamp = (Get-Date).ToString("s")
  Add-Content -Path $logPath -Value "[$timestamp] [$Level] $Message" -Force
}

function Invoke-Git {
  param([string[]]$GitArgs)

  $output = & git -C $RepoRoot @GitArgs 2>&1
  if ($LASTEXITCODE -ne 0) {
    $rendered = ($output | Out-String).Trim()
    throw ("git {0} failed: {1}" -f ($GitArgs -join " "), $rendered)
  }

  return $output
}

if (-not (Test-Path $gitMetaPath)) {
  throw "Git metadata not found under $RepoRoot"
}

foreach ($guardPath in @("index.lock", "rebase-merge", "rebase-apply", "MERGE_HEAD")) {
  $fullGuardPath = Join-Path $gitMetaPath $guardPath
  if (Test-Path $fullGuardPath) {
    Write-AutoCommitLog -Level "WARN" -Message "Git operation already in progress ($guardPath); skipping."
    exit 0
  }
}

$branchOutput = Invoke-Git -GitArgs @("branch", "--show-current")
$branchName = ($branchOutput | Select-Object -First 1).ToString().Trim()
if ([string]::IsNullOrWhiteSpace($branchName)) {
  throw "Unable to detect the current branch."
}

$statusOutput = Invoke-Git -GitArgs @("status", "--porcelain=v1")
if ($statusOutput.Count -eq 0) {
  Write-AutoCommitLog -Level "INFO" -Message "No changes detected; skipping commit."
  exit 0
}

if ($DryRun) {
  Write-AutoCommitLog -Level "INFO" -Message ("Dry run detected {0} pending change line(s) on branch {1}." -f $statusOutput.Count, $branchName)
  exit 0
}

$commitMessage = "chore(auto): Second-Brain-Blueprint snapshot {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm")

try {
  Write-AutoCommitLog -Level "INFO" -Message "Staging changes on branch $branchName."
  Invoke-Git -GitArgs @("add", "-A") | Out-Null

  & git -C $RepoRoot diff --cached --quiet --exit-code
  if ($LASTEXITCODE -eq 0) {
    Write-AutoCommitLog -Level "INFO" -Message "No staged changes after add; skipping commit."
    exit 0
  }
  if ($LASTEXITCODE -ne 1) {
    throw "git diff --cached --quiet returned unexpected exit code $LASTEXITCODE"
  }

  Write-AutoCommitLog -Level "INFO" -Message "Creating commit: $commitMessage"
  Invoke-Git -GitArgs @("commit", "-m", $commitMessage) | Out-Null

  Write-AutoCommitLog -Level "INFO" -Message "Rebasing against origin/$branchName."
  Invoke-Git -GitArgs @("pull", "--rebase", "origin", $branchName) | Out-Null

  Write-AutoCommitLog -Level "INFO" -Message "Pushing to origin/$branchName."
  Invoke-Git -GitArgs @("push", "origin", "HEAD:$branchName") | Out-Null

  Write-AutoCommitLog -Level "INFO" -Message "Auto commit and push completed successfully."
} catch {
  Write-AutoCommitLog -Level "ERROR" -Message $_.Exception.Message
  throw
}
