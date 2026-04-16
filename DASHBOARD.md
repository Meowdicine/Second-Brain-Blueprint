---
title: Dashboard
date: 2026-04-15
tags: [dashboard, execution, starter]
---

# Dashboard

This page is the action-first execution layer of the starter.

Use it to decide what to do now.
Use the wiki to preserve what matters after the work is done.

## This Week's Deliverables

| Deliverable | Status | Link |
|---|---|---|
| Turn one active project into a durable project brief | pending | `10_Projects/Sample-Project-Launch.md` |
| Ingest one source and promote the takeaway into Learning | pending | `20_Areas/Learning/Learning.md` |
| Run a weekly review and reduce one system friction point | pending | `20_Areas/Operations/Operations.md` |

## Next Actions

| Area | Action | Status |
|---|---|---|
| Work | Choose the highest-leverage active project and make the next shippable step explicit | pending |
| Learning | Convert one raw input into a short synthesis note | pending |
| Operations | Empty part of `00_Inbox/` and update the system log if the workflow changed | pending |

## Current Working Set

- `Work` - [`20_Areas/Work/Work.md`](20_Areas/Work/Work.md)
- `Learning` - [`20_Areas/Learning/Learning.md`](20_Areas/Learning/Learning.md)
- `Operations` - [`20_Areas/Operations/Operations.md`](20_Areas/Operations/Operations.md)
- `Sample Project` - [`10_Projects/Sample-Project-Launch.md`](10_Projects/Sample-Project-Launch.md)
- `Workflow` - [`99_System/Guides/WORKFLOW.md`](99_System/Guides/WORKFLOW.md)
- `Source Index` - [`90_Attachments/SOURCE-INDEX.md`](90_Attachments/SOURCE-INDEX.md)

## Working Rules

- Markdown is the durable memory layer.
- Agents are the control layer.
- The dashboard is optional and should never become the source of truth.
- Keep the public template generic and move real personal content into a private instance.

## Weekly Review Loop

1. Close or refresh stale actions on this page.
2. Route important outcomes back into projects, areas, or synthesis notes.
3. Update `99_System/LOG.md` if the system itself changed.
4. Run a quick lint pass on links, naming, and privacy boundaries.

## Optional Dashboard Runtime

```bash
cd dashboard
npm install
npm run dev
```

Requirements:

- Node `>=22 <23`
- npm `>=10 <11`
