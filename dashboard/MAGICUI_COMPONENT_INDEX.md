# Magic UI Reproducible Component Index

This file is the local source of truth for reusable Magic UI components in this dashboard.

## Required Workflow

1. Check Magic UI before building custom animation or layout code.
2. Reuse upstream patterns when practical.
3. Record where each component is used.

## Installed Component Registry

| Component | Docs | Install Command | Local File | Current Usage | Status | Last Verified |
|---|---|---|---|---|---|---|
| Blur Fade | https://magicui.design/docs/components/blur-fade | `pnpm dlx shadcn@latest add @magicui/blur-fade` | `components/magicui/blur-fade.tsx` | `app/dashboard/page.tsx` | In use | 2026-04-15 |
| Border Beam | https://magicui.design/docs/components/border-beam | `pnpm dlx shadcn@latest add @magicui/border-beam` | `components/magicui/border-beam.tsx` | `components/cards/kpi-card.tsx` | In use | 2026-04-15 |
| Shine Border | https://magicui.design/docs/components/shine-border | `pnpm dlx shadcn@latest add @magicui/shine-border` | `components/magicui/shine-border.tsx` | Optional accent surfaces | Ready to use | 2026-04-15 |
| Bento Grid | https://magicui.design/docs/components/bento-grid | `pnpm dlx shadcn@latest add @magicui/bento-grid` | `components/magicui/bento-grid.tsx` | `app/dashboard/page.tsx`, `app/goals/page.tsx` | In use | 2026-04-15 |
| Magic Card | https://magicui.design/docs/components/magic-card | `pnpm dlx shadcn@latest add @magicui/magic-card` | `components/magicui/magic-card.tsx` | `app/dashboard/page.tsx`, `app/goals/page.tsx` | In use | 2026-04-15 |
| Animated List | https://magicui.design/docs/components/animated-list | `pnpm dlx shadcn@latest add @magicui/animated-list` | `components/magicui/animated-list.tsx` | `app/achievements/page.tsx`, `app/notes/page.tsx` | In use | 2026-04-15 |
