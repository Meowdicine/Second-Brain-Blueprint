# Dashboard Customization Guide

This dashboard is intentionally lightweight.

Change the data first.
Change the visuals second.

## Data Files

Update these files to change the starter content:

- `../dashboard-data/home.json`
- `../dashboard-data/work.json`
- `../dashboard-data/learning.json`
- `../dashboard-data/operations.json`

## Main Customization Points

- `app/dashboard/page.tsx`
  Dashboard landing page and card layout
- `app/goals/page.tsx`
  Goals overview
- `app/goals/[slug]/page.tsx`
  Goal detail pages
- `components/layout/sidebar.tsx`
  Sidebar navigation and launchpad behavior
- `components/cards/kpi-card.tsx`
  Shared card styling
- `app/globals.css`
  Global color tokens and atmosphere

## Recommended Order

1. Replace starter JSON values.
2. Adjust note paths to your private instance.
3. Change labels or copy only if your operating model truly differs.
4. Touch visuals last so the dashboard still reflects the actual workflow.
5. Keep launchpad actions aligned with the actual Markdown entrypoints.

## Design Constraint

Do not turn the dashboard into the only way the repo makes sense.

The repo should still be understandable from:

- `README.md`
- `DASHBOARD.md`
- `INDEX.md`
- `AGENTS.md`
- `99_System/Agent-Kernel.md`
