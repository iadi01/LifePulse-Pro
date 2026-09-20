# LifePulse-Pro

### One interface. Three perspectives. Money. Risk. Listening.

> **LifePulse** is a production-quality, frontend-only personal data intelligence web application built for the **WebRush 2026 Hackathon**. It transforms three organizer-provided datasets into an interactive data exploration and analytics platform across three distinct analytical lenses.

---

## Overview

LifePulse provides a unified glass cockpit for exploring three completely separate real-world data dimensions:
1. **Money**: Household financial activity, recurring cash flows, and category expenditures from 2,461 daily household transactions.
2. **Risk**: High-fidelity transaction monitoring, spatial fraud clustering, and category risk intelligence from 10,267 India transaction records.
3. **Listening**: 11-year longitudinal streaming chronicle from 149,860 Spotify events (5,341+ hours), profiling artist affinities and playback mechanics.

The three datasets represent distinct analytical domains and are never falsely merged or attributed to a single persona.

---

## Core Features

### 1. Overview Dashboard
- **Perspective Switcher**: Instant global lens toggle (`[ All ] [ Money ] [ Risk ] [ Listening ]`).
- **12 Interactive KPI Cards**: Clickable cards that deep-link directly into corresponding views with pre-filtered context.
- **Visual Analytics Grid**:
  - **Spending & Financial Overview**: Area chart comparing income, expenses, and investments over time with period selectors (`[ 7D ] [ 30D ] [ 90D ] [ All ]`).
  - **Transaction Risk Classification**: Interactive segmented donut chart showing Safe, Fraud, and Unknown transactions with click-to-filter mechanics.
  - **Top Spending Categories**: Horizontal bar chart mapping primary household outflows.
  - **Listening Activity Timeline**: Multi-year streaming volume and listening duration tracker.

### 2. Money & Household Financial Intelligence
- **Audited Metrics**: Total income, total expenses, total investment volume, average transaction value, and record counts.
- **Spending Category Breakdown**: Visualizing actual categories (`Food`, `Transportation`, `Health`, `Investment`, `Salary`, etc.).
- **Payment Method Analysis**: Empirical distribution across payment channels (`Cash`, `Credit Card`, `Debit Card`, `Bank Accounts`, `Mutual Funds`).
- **Income vs Expense Engine**: Switch between Monthly Trend, By Category, and By Payment Mode views.
- **Household Transaction Table**: Searchable, filterable, and paginated table with real-time summary recalculation.

### 3. Transaction Intelligence & Risk Dashboard
- **Risk KPIs**: Total transaction volume, 5,046 confirmed fraud alerts, 4,576 safe transactions, and 645 strictly audited unknown signals.
- **Fraud by Category**: Horizontal bar chart identifying high-incident categories (`Online Shopping`, `Travel`, `Entertainment`, `Fitness & Medical`).
- **Temporal Risk Timeline**: Area chart tracking fraud waves versus legitimate transactions across months.
- **Spatial Fraud Dispersion**: Geographic state analysis across Indian regions with click-to-filter capability.
- **Interactive Transaction Explorer**:
  - Multi-parameter filtering: Full-text search, Category, Risk status (`All`, `Safe`, `Fraud`, `Unknown`), State, Amount range, and Date sorting.
  - Semantic risk indicators: `▲ Fraud`, `● Safe`, `? Unknown`.
- **Slide-out Transaction Detail Drawer**:
  - Full transaction audit view with merchant metadata, geographic coordinates, and customer profiles.
  - **Privacy Enforcement**: Strict redacting of sensitive account numbers (`•••• •••• •••• 1234`).

### 4. Spotify Listening Intelligence
- **Longitudinal Streaming KPIs**: 149,860 total plays, 5,341.5 hours listened, 4,113 unique artists, 14,639 unique tracks, 5.2% skip rate, 74.5% shuffle rate.
- **Top Artists Catalog**: Ranked artist cards featuring play counts, hours, catalog track breadth, and skip rates.
- **Interactive Artist Profile Modal**: Inspect any artist to see their total duration, skip rate, and ranked catalog hits.
- **Track Analysis**: Searchable catalog of top tracks with duration, play count, and completion rate.
- **Behavior Analytics Lab**:
  - Stream Completion vs Skip Rate distribution.
  - Shuffle Mode vs Sequential playback breakdown.
  - Platform distribution (`Android`, `Cast to Device`, `iOS`, `Windows`, `Mac`).
  - Playback initiation (`reason_start`) and termination (`reason_end`) mechanics.

### 5. Empirical Data Insights
- **100% Deterministic**: Zero speculative AI claims or fabricated numbers. Every observation is computed mathematically from the real datasets.
- Direct deep-links (`View Data →`) on every card taking the user directly to the filtered dataset view.

### 6. Command Palette (`Cmd + K` / `Ctrl + K`)
- Keyboard-driven command interface.
- Instant search across transactions, artists, and tracks.
- Jump to any section or toggle dark/light theme instantly.

---

## Datasets

All three datasets provided by the organizers are included and processed:

| Dataset | Records | Date Range | Primary Focus |
|---|---|---|---|
| **Daily Household Transactions** | 2,461 | 2018 - 2021 | Personal finance, categories, modes |
| **Augmented India Transactions** | 10,267 | 2023 - 2024 | Transaction fraud, location, merchants |
| **Spotify Listening History** | 149,860 | 2013 - 2024 | Audio streaming behavior, artists, tracks |

---

## Large Dataset Strategy & Performance

1. **Offline Preprocessing Script (`scripts/preprocess_data.py`)**:
   - Cleans null values, standardizes dates, and masks sensitive credit card data.
   - Computes aggregations, rankings, and time series ahead of time.
2. **Clean JSON Storage (`public/data/`)**:
   - `transactions_summary.json` (4.5 KB): Loaded immediately for instantaneous overview and risk chart rendering.
   - `household.json` (546 KB): Complete 2,461 rows and summary metrics for the money explorer.
   - `spotify_summary.json` (402 KB): Pre-computed catalog of top 100 artists, top 100 tracks, platforms, and behavioral stats.
   - `transactions.json` (4.2 MB): Loaded asynchronously in the background so initial load is never blocked.
3. **Bundle Optimization**:
   - Recharts and Lucide icons are separated into dedicated vendor chunks via Vite Rollup manual chunking.
   - Application code is only ~154 kB (~34 kB gzipped).

---

## Technology Stack

- **Framework**: React 18 / TypeScript / Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts (`ResponsiveContainer`, `AreaChart`, `BarChart`, `PieChart`)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## Accessibility & Responsive Design

- **Accessibility**:
  - Semantic HTML landmarks (`<aside>`, `<header>`, `<main>`, `<nav>`, `<table>`).
  - High-contrast visual cues (`▲ Fraud`, `● Safe`, `? Unknown`).
  - Full keyboard navigability in tables and the `Cmd+K` command palette.
- **Responsive Layout**:
  - Tested across mobile (320px, 375px, 390px), tablet (768px), and desktop (1024px, 1440px).
  - Desktop: Persistent left sidebar with real-time dataset badges.
  - Mobile: Fixed bottom navigation bar and touch-friendly slide-out drawer.
  - Slide drawers adapt to full width on mobile viewports.

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# 1. Navigate to project folder
cd lifepulse

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Or build and preview production bundle
npm run build
npm run preview
```

Open `http://localhost:5173/` in your browser.

---

## Project Structure

```text
lifepulse/
├── public/
│   └── data/
│       ├── household.json
│       ├── transactions.json
│       ├── transactions_summary.json
│       └── spotify_summary.json
├── scripts/
│   └── preprocess_data.py
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CategoryBarChart.tsx
│   │   │   ├── FraudCategoryChart.tsx
│   │   │   ├── ListeningTimelineChart.tsx
│   │   │   ├── PaymentModeChart.tsx
│   │   │   ├── RiskDonutChart.tsx
│   │   │   └── SpendingTrendChart.tsx
│   │   ├── common/
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── KpiCard.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Skeleton.tsx
│   ├── features/
│   │   ├── insights/
│   │   │   └── InsightsPage.tsx
│   │   ├── listening/
│   │   │   ├── ArtistDetailModal.tsx
│   │   │   ├── ArtistsSection.tsx
│   │   │   ├── BehaviorSection.tsx
│   │   │   ├── ListeningPage.tsx
│   │   │   └── TracksSection.tsx
│   │   ├── money/
│   │   │   └── MoneyPage.tsx
│   │   ├── overview/
│   │   │   └── OverviewPage.tsx
│   │   └── transactions/
│   │       ├── RiskDashboard.tsx
│   │       ├── TransactionDetailDrawer.tsx
│   │       ├── TransactionExplorer.tsx
│   │       └── TransactionsPage.tsx
│   ├── lib/
│   │   ├── formatters.ts
│   │   └── utils.ts
│   ├── store/
│   │   ├── useDataStore.ts
│   │   ├── useFilterStore.ts
│   │   └── useUIStore.ts
│   ├── types/
│   │   ├── household.ts
│   │   ├── index.ts
│   │   ├── spotify.ts
│   │   └── transaction.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Limitations

- **Dataset Decoupling**: The datasets reflect distinct source populations and are intentionally not matched to a single persona.
- **Frontend-Only**: No server-side mutations or remote database calls. All indexing and filtering occur inside browser memory.
