# Dashboard

This dashboard is the optional visual layer for the Second-Brain-Blueprint starter.

It is useful for:

- next actions
- weekly deliverables
- lightweight status review
- a visual control surface for Work, Learning, and Operations

It is not the required first-run workflow.

The source of truth stays in Markdown notes and starter data files.

## Before You Change UI

1. Check `MAGICUI_COMPONENT_INDEX.md`.
2. Prefer reusing installed Magic UI patterns.
3. Keep the dashboard aligned with the Markdown-first operating model.

## Quick Start

```bash
cd dashboard
npm install
npm run dev
```

Open `http://localhost:3000`.

Requirements:

- Node `>=22 <23`
- npm `>=10 <11`

## What This Dashboard Reads

- `../dashboard-data/home.json`
- `../dashboard-data/work.json`
- `../dashboard-data/learning.json`
- `../dashboard-data/operations.json`

It also links back into the starter notes:

- `../20_Areas/Work/Work.md`
- `../20_Areas/Learning/Learning.md`
- `../20_Areas/Operations/Operations.md`
- `../DASHBOARD.md`

## Launchpad

The sidebar launchpad is the dashboard's main control surface.

It ranks actions using:

- the current route
- recently opened notes
- optional Google Tasks context

It should help you return to Markdown notes faster.
It should not become a replacement for the wiki.

## Google Tasks Integration

Google Tasks is optional.

If configured, the dashboard uses Google Tasks as the main next-actions source.
If not configured, it falls back to `dashboard-data/home.json`.

Env template:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_TASKLIST_WORK_NAME`
- `GOOGLE_TASKLIST_LEARNING_NAME`
- `GOOGLE_TASKLIST_OPERATIONS_NAME`
- `GOOGLE_TASKLIST_GENERAL_NAME`
- `GOOGLE_TASKS_SINGLE_LIST_MODE`
- `GOOGLE_TASKLIST_PRIMARY_NAME`
- `GOOGLE_TOKEN_STORE_PATH`
- `EXTERNAL_OPEN_ENABLED`

## Design Rule

The dashboard should make the wiki easier to operate.

It should never replace:

- note maintenance
- project notes
- area notes
- system guides
- privacy checks
