---
title: Cursor Usage Guide
date: 2025-01-07
tags: [system, guides, cursor, tools]
---

# Cursor Usage Guide

Guide for using Cursor's Chat and Edit features effectively.

## Chat vs Edit

### Chat (对话模式)
- **Purpose**: Discussion, questions, explanations, and suggestions (讨论、提问、解释和建议)
- **Use when**: 
  - You want to understand code or concepts (想理解代码或概念)
  - You need explanations or suggestions (需要解释或建议)
  - You want to discuss approaches before making changes (想在修改前讨论方案)
  - You need help with knowledge management tasks (需要知识管理方面的帮助)

### Edit (编辑模式)
- **Purpose**: Direct code/file modifications (直接修改代码/文件)
- **Use when**:
  - You want AI to directly modify files (想让AI直接修改文件)
  - You have a clear change in mind (有明确的修改想法)
  - You want to apply changes immediately (想立即应用更改)

## How to Use Chat in Cursor

### Method 1: Chat Panel (聊天面板)

1. **Open Chat Panel**:
   - Press `Ctrl+L` (Windows/Linux) or `Cmd+L` (Mac) to open Chat
   - Or click the Chat icon in the sidebar
   - Or use Command Palette: `Ctrl+Shift+P` → "Cursor: Open Chat"

2. **Chat Features**:
   - Ask questions about your codebase
   - Get explanations
   - Request suggestions
   - Discuss approaches
   - **AI will NOT automatically edit files** - it will provide responses and suggestions

### Method 2: Inline Chat (行内聊天)

1. **Select code** and press `Ctrl+L` (or `Cmd+L` on Mac)
2. Chat will open with context about the selected code
3. Ask questions or request explanations
4. AI responds without automatically editing

### Method 3: Composer (组合器) - For Multi-file Changes

1. Press `Ctrl+I` (Windows/Linux) or `Cmd+I` (Mac)
2. This opens Composer mode
3. You can request changes, but you review before applying
4. More control than direct Edit

## Best Practices

### When to Use Chat

✅ **Use Chat for**:
- Understanding existing code (理解现有代码)
- Getting explanations (获取解释)
- Discussing approaches (讨论方案)
- Asking questions about your knowledge base (询问知识库相关问题)
- Getting suggestions without immediate changes (获取建议但不立即修改)
- Learning and exploration (学习和探索)

### When to Use Edit

✅ **Use Edit for**:
- Clear, specific changes (明确、具体的修改)
- Quick fixes (快速修复)
- When you're confident about the change (对修改有信心时)

## Tips for Knowledge Management

### Using Chat for PKM Tasks

When working with your knowledge management system:

1. **Ask questions in Chat**:
   ```
   "How should I organize this note?"
   "What tags would be appropriate for this document?"
   "Can you explain the CODA workflow?"
   ```

2. **Get suggestions without changes**:
   ```
   "Suggest a structure for this new note"
   "What should I link this document to?"
   ```

3. **Review before applying**:
   - Chat gives you suggestions
   - You decide what to implement
   - Then use Edit if needed, or make changes manually

### Example Workflow

1. **Chat**: "I want to add a new note about X. How should I structure it?"
2. **AI responds** with suggestions
3. **You review** the suggestions
4. **You decide** to either:
   - Use Edit to implement
   - Make changes manually
   - Ask follow-up questions in Chat

## Keyboard Shortcuts

- `Ctrl+L` / `Cmd+L`: Open Chat
- `Ctrl+I` / `Cmd+I`: Open Composer (multi-file editing)
- `Ctrl+K` / `Cmd+K`: Inline Edit (direct edit)
- `Ctrl+Shift+P`: Command Palette

## Chat History and Backup (聊天记录与备份)

### Chat History Storage (聊天记录存储)

**Important**: Cursor chat history is stored **locally** on your computer, not in the cloud or synced with your Cursor account. (重要：Cursor 聊天记录存储在本地，不会上传到云端或与账户同步)

**Storage Locations (存储位置)**:

- **Windows**: 
  ```
  C:\Users\<YourUsername>\AppData\Roaming\Cursor
  ```
- **macOS**: 
  ```
  /Users/<YourUsername>/Library/Application Support/Cursor
  ```
- **Linux**: 
  ```
  /home/<YourUsername>/.config/Cursor
  ```

### Data Loss Risk (数据丢失风险)

⚠️ **Warning**: Chat history can be lost if you (警告：以下情况可能导致聊天记录丢失):
- Reinstall Cursor without backing up (重装 Cursor 前未备份)
- Uninstall Cursor completely (完全卸载 Cursor)
- Format your computer (格式化电脑)
- Delete the Cursor data directory (删除 Cursor 数据目录)

### Backup Recommendations (备份建议)

**Before Reinstalling Cursor (重装前)**:

1. **Backup the Cursor directory** (备份 Cursor 目录):
   - Copy the entire Cursor data directory to a safe location
   - (将整个 Cursor 数据目录复制到安全位置)
   
2. **Suggested backup locations** (建议的备份位置):
   - External drive or cloud storage (外置硬盘或云存储)
   - Your OneDrive/Dropbox (OneDrive/Dropbox)
   - A dedicated backup folder (专门的备份文件夹)

**Example backup workflow** (示例备份流程):

```bash
# Windows PowerShell example
# 备份到当前目录
Copy-Item -Path "$env:APPDATA\Cursor" -Destination ".\Cursor-Backup" -Recurse

# 或备份到 OneDrive
Copy-Item -Path "$env:APPDATA\Cursor" -Destination "$env:OneDrive\Backups\Cursor" -Recurse
```

### Restore Chat History (恢复聊天记录)

**After Reinstalling** (重装后):

1. **Close Cursor** (关闭 Cursor)
2. **Copy backup to the Cursor directory** (将备份复制到 Cursor 目录):
   - Replace the new Cursor directory with your backup
   - (用备份替换新的 Cursor 目录)
3. **Restart Cursor** (重启 Cursor)

**Important Notes** (重要提示):

- ⚠️ **If you didn't backup before reinstalling, chat history cannot be recovered** (如果重装前未备份，聊天记录无法恢复)
- 💡 **Regular backups** are recommended, especially before major updates or reinstalls (建议定期备份，特别是在重大更新或重装前)
- 🔄 **Consider setting up automatic backups** for the Cursor directory (考虑为 Cursor 目录设置自动备份)

### GitHub Sync (GitHub 同步)

**Question: Will chat history be synced to GitHub?** (聊天记录会被同步到 GitHub 吗？)

**Answer: No, chat history will NOT be synced to GitHub automatically.** (答案：不会，聊天记录不会自动同步到 GitHub)

**Why not? (为什么不会？)**

1. **Storage Location (存储位置)**:
   - Chat history is stored in system directories (聊天记录存储在系统目录中):
     - Windows: `C:\Users\<Username>\AppData\Roaming\Cursor`
     - Not in your project directory (不在项目目录中)
   - These system directories are **outside your Git repository** (这些系统目录在你的 Git 仓库之外)

2. **Your `.gitignore` Configuration (你的 .gitignore 配置)**:
   - Your `.gitignore` already excludes `.cursor/` directory (你的 `.gitignore` 已经排除了 `.cursor/` 目录)
   - Even if Cursor creates config files in project directory, they won't be tracked (即使 Cursor 在项目目录中创建配置文件，也不会被跟踪)

3. **Privacy by Default (默认隐私保护)**:
   - Cursor stores chat history locally for privacy (Cursor 将聊天记录存储在本地以保护隐私)
   - No automatic cloud sync (没有自动云同步)

**Manual Sync Options (手动同步选项)**:

If you want to backup chat history to GitHub (如果你想将聊天记录备份到 GitHub):

1. ⚠️ **Create a PRIVATE repository** (创建私有仓库)
2. Manually copy chat history to a backup location (手动复制聊天记录到备份位置)
3. Commit to your private repo (提交到私有仓库)

**Recommended Approach (推荐方法)**:

Instead of syncing all chat history, consider (不要同步所有聊天记录，考虑):

1. **Export important conversations** to your knowledge base (将重要对话导出到知识库)
2. Save key insights as notes (保存关键洞察为笔记)
3. Use Git for your knowledge base, not chat history (使用 Git 管理知识库，而不是聊天记录)

This way, important information is preserved in your knowledge base, which is already synced to GitHub. (这样，重要信息保存在知识库中，而知识库已经同步到 GitHub)

### Alternative: Export Important Conversations (替代方案：导出重要对话)

If chat history is important, consider (如果聊天记录重要，考虑):

1. **Copy important conversations** to your knowledge base (将重要对话复制到知识库)
2. **Save key insights** as notes in `00_Inbox/` or relevant directories (将关键洞察保存为笔记)
3. **Use the knowledge base** as your permanent record (使用知识库作为永久记录)

This aligns with the [[WORKFLOW|CODA workflow]] principle of capturing important information. (这与 CODA 工作流的捕捉原则一致)

## Multi-Agent Parallel Processing (多 Agent 并行处理)

### Overview (概述)

Cursor 2.0+ supports **Multi-Agent** system, allowing you to run multiple agents in parallel on the same project. (Cursor 2.0+ 支持多 Agent 系统，允许你在同一项目中并行运行多个 Agent)

**Key Features (关键特性)**:

- ✅ **Parallel Execution** (并行执行): Run up to **8 agents simultaneously** (最多同时运行 8 个 Agent)
- ✅ **Independent Workspaces** (独立工作空间): Each agent works in a separate codebase copy (每个 Agent 在独立的代码库副本中工作)
- ✅ **No File Conflicts** (无文件冲突): Agents use Git worktree or remote machines (Agent 使用 Git worktree 或远程机器)
- ✅ **Visual Management** (可视化管理): View and manage all running agents in sidebar (在侧边栏查看和管理所有运行的 Agent)

### How to Use Multi-Agents (如何使用多 Agent)

#### Step 1: Open Agent List (打开 Agent 列表)

**Keyboard Shortcut**:
- **Windows/Linux**: `Ctrl + '` (Ctrl + 单引号)
- **macOS**: `Cmd + '` (Cmd + 单引号)

Or use Command Palette: `Ctrl+Shift+P` → "Cursor: Show Background Agents" (或使用命令面板)

#### Step 2: Create New Agent (创建新 Agent)

1. Click **"New Agent"** or **"+"** button (点击"新建 Agent"或"+"按钮)
2. Choose running environment (选择运行环境):
   - **Cloud** (云端): Remote Ubuntu environment (远程 Ubuntu 环境)
   - **Work Tree** (工作树): Local Git worktree (本地 Git 工作树)
   - **Local** (本地): Direct local workspace (直接本地工作区)
3. Enter task description (输入任务描述)

#### Step 3: Monitor Agent Status (监控 Agent 状态)

**View Status**:
- **Windows/Linux**: `Ctrl + ;` (Ctrl + 分号)
- **macOS**: `Cmd + ;` (Cmd + 分号)

This opens the agent status view where you can (这会打开 Agent 状态视图，你可以):
- See all running agents (查看所有运行的 Agent)
- Check progress (检查进度)
- Access agent's workspace (访问 Agent 的工作空间)
- Review changes (审查更改)

#### Step 4: Review and Merge (审查和合并)

1. **Review changes** made by each agent (审查每个 Agent 所做的更改)
2. **Test changes** in agent's workspace (在 Agent 的工作空间中测试更改)
3. **Merge or discard** changes as needed (根据需要合并或丢弃更改)

### Parallel Processing Example (并行处理示例)

**Scenario**: You want to work on multiple features simultaneously (场景：你想同时处理多个功能)

**Example Tasks** (示例任务):
- Agent 1: "Refactor authentication module" (重构认证模块)
- Agent 2: "Add unit tests for API endpoints" (为 API 端点添加单元测试)
- Agent 3: "Update documentation" (更新文档)
- Agent 4: "Fix bug in payment processing" (修复支付处理中的 bug)

**Workflow** (工作流程):

1. **Create 4 agents** with different tasks (创建 4 个不同任务的 Agent)
2. **All agents run in parallel** (所有 Agent 并行运行)
3. **Each agent works independently** (每个 Agent 独立工作)
4. **No conflicts** because each uses separate workspace (无冲突，因为每个使用独立工作空间)
5. **Review and merge** changes one by one (逐一审查和合并更改)

### Best Practices (最佳实践)

#### ✅ When to Use Multi-Agents (何时使用多 Agent)

- **Large projects** with multiple independent features (具有多个独立功能的大型项目)
- **Time-sensitive tasks** that can be parallelized (可以并行化的时间敏感任务)
- **Different expertise areas** (e.g., frontend, backend, tests) (不同专业领域，如前端、后端、测试)
- **Independent refactoring tasks** (独立的重构任务)

#### ⚠️ When NOT to Use Multi-Agents (何时不使用多 Agent)

- **Small, simple changes** (小而简单的更改)
- **Tasks that depend on each other** (相互依赖的任务)
- **Single file modifications** (单文件修改)
- **Quick fixes** (快速修复)

#### 💡 Tips (提示)

1. **Clear task descriptions** (清晰的任务描述):
   - Be specific about what each agent should do (明确每个 Agent 应该做什么)
   - Define scope and boundaries (定义范围和边界)

2. **Monitor regularly** (定期监控):
   - Check agent status frequently (频繁检查 Agent 状态)
   - Review changes as they complete (在完成时审查更改)

3. **Test before merging** (合并前测试):
   - Always test changes in agent workspace (始终在 Agent 工作空间中测试更改)
   - Ensure no breaking changes (确保没有破坏性更改)

4. **Use appropriate environment** (使用合适的环境):
   - **Cloud**: For complex tasks requiring setup (需要设置的复杂任务)
   - **Work Tree**: For parallel development (并行开发)
   - **Local**: For quick changes (快速更改)

### Important Notes (重要提示)

#### Environment Setup (环境设置)

⚠️ **First-time setup required** (首次需要设置):
- When using agents in a new repository, you need to set up the environment (在新仓库中使用 Agent 时，需要设置环境)
- Install dependencies and start necessary services (安装依赖并启动必要的服务)
- This is a one-time setup per repository (每个仓库只需设置一次)

#### Model Requirements (模型要求)

- **Max Mode compatible models only** (仅支持 Max Mode 兼容的模型)
- **Token-based billing** (基于 token 的计费)
- Each agent consumes tokens independently (每个 Agent 独立消耗 token)

#### Security Considerations (安全考虑)

- **GitHub permissions required** (需要 GitHub 权限):
  - Agents need read/write access to your repository (Agent 需要仓库的读写权限)
  - Code runs on Cursor's AWS infrastructure (代码在 Cursor 的 AWS 基础设施上运行)
- **Private repositories recommended** (推荐使用私有仓库)
- **Review all changes** before merging (合并前审查所有更改)

### Keyboard Shortcuts Summary (快捷键总结)

| Action (操作) | Windows/Linux | macOS |
|--------------|---------------|-------|
| Open Agent List (打开 Agent 列表) | `Ctrl + '` | `Cmd + '` |
| View Agent Status (查看 Agent 状态) | `Ctrl + ;` | `Cmd + ;` |
| Open Chat (打开聊天) | `Ctrl + L` | `Cmd + L` |
| Open Composer (打开组合器) | `Ctrl + I` | `Cmd + I` |

## Summary

**Chat = Discussion and Suggestions** (讨论和建议)
- No automatic file changes
- You control what gets implemented
- Better for understanding and planning
- **History stored locally, requires manual backup** (聊天记录存储在本地，需要手动备份)

**Edit = Direct Modifications** (直接修改)
- AI makes changes immediately
- Faster for clear, simple changes
- Less control over the process

**Multi-Agent = Parallel Processing** (多 Agent = 并行处理)
- Run up to 8 agents simultaneously (最多同时运行 8 个 Agent)
- Independent workspaces prevent conflicts (独立工作空间防止冲突)
- Best for large projects with multiple tasks (最适合具有多个任务的大型项目)

For knowledge management work, **prefer Chat** to discuss and plan before making changes.

For large projects, **consider Multi-Agent** to parallelize independent tasks.

**Remember to backup your Cursor directory regularly!** (记得定期备份 Cursor 目录！)

---

**Last Updated**: 2025-01-08


