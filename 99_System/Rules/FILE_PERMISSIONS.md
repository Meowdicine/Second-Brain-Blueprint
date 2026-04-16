# File Permissions

This file defines the safe editing boundary for the public starter.

## Read-Only By Default

- `.obsidian/`
- local secret files such as `.env`
- generated runtime token stores

These may be inspected when necessary, but should not be committed or casually rewritten.

## Deliberate Edits Allowed

- starter notes under `00_Inbox/`, `10_Projects/`, `20_Areas/`, and `30_Resources/`
- dashboard sample data under `dashboard-data/`
- control-layer files such as `AGENTS.md`, `CLAUDE.md`, and `.cursor/rules/*.mdc`
- templates and guides under `99_System/`

## Public Boundary

Edits are allowed only if they keep the repo publishable as a framework layer.

Do not commit:

- secrets
- private personal records
- private contact networks
- real private KPI dashboards

Use `PRIVACY.md` when in doubt.
