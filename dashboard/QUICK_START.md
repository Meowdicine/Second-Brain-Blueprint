# Dashboard Quick Start

## Run The Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open `http://localhost:3000`.

After the app loads:

1. use the sidebar launchpad to open the most relevant note or tool
2. make changes in Markdown notes first
3. treat the dashboard as an execution surface, not the knowledge base

## Update Starter Data

Edit:

- `../dashboard-data/home.json`
- `../dashboard-data/work.json`
- `../dashboard-data/learning.json`
- `../dashboard-data/operations.json`

## Useful First Changes

1. Replace the sample metrics in `dashboard-data/*.json`.
2. Point the starter notes toward your real private instance notes.
3. Configure Google Tasks only if you want synced next actions.

## Runtime Requirements

- Node `>=22 <23`
- npm `>=10 <11`
