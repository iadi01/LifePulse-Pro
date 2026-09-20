# LifePulse-Pro

### One interface. Three perspectives. Money. Risk. Listening.

> **LifePulse-Pro** is a production-quality, frontend-only personal data intelligence web application built for the **WebRush 2026 Hackathon**. It transforms three organizer-provided datasets into an interactive data exploration and analytics platform across three distinct analytical lenses.

---

## Overview

LifePulse provides a unified glass cockpit for exploring three completely separate real-world data dimensions:
1. **Money**: Household financial activity, recurring cash flows, and category expenditures from 2,461 daily household transactions.
2. **Risk**: High-fidelity transaction monitoring, spatial fraud clustering, and category risk intelligence from 10,267 India transaction records.
3. **Listening**: 11-year longitudinal streaming chronicle from 149,860 Spotify events (5,341+ hours), profiling artist affinities and playback mechanics.

The three datasets represent distinct analytical domains and are never falsely merged or attributed to a single persona.

---

## Problem

Modern personal data is deeply fragmented across siloed services. Financial ledgers, banking transaction streams, fraud risk flags, and media entertainment chronicles exist in disparate platforms and formats:
- Inconsistent schemas with missing, null, or unclassified data (e.g. 645 unclassified fraud records).
- Sensitive privacy concerns (e.g. raw credit card numbers requiring strict redaction).
- Large dataset scales (e.g. 150k+ raw streaming events) that cause browser freezes if processed synchronously.
- Misleading dashboards that fabricate relationships or mix unrelated individuals into a single fake identity.

---

## Solution

LifePulse-Pro resolves this by introducing a **three-perspective analytical architecture**:
- **Domain Independence**: Respects the separation of Money, Risk, and Listening without synthetic conflation.
- **Strict Data Auditing**: Explicitly handles null values with safe fallbacks (`Safe`, `Fraud`, `Unknown`) without data loss.
- **Privacy By Design**: Complete client-side masking of sensitive customer identifiers and card numbers.
- **Deterministic Insights**: Computes mathematical facts directly from the underlying data with direct deep-links.
- **Your Life, In Receipts 🧾**: Generates a unified, printable thermal summary receipt synthesizing all three domains.

---

## Features

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
- **Slide-out Transaction Detail Drawer**: Full audit view with merchant metadata, coordinates, and privacy-masked card numbers (`•••• •••• •••• 1234`).

### 4. Spotify Listening Intelligence
- **Longitudinal Streaming KPIs**: 149,860 total plays, 5,341.5 hours listened, 4,113 unique artists, 14,639 unique tracks, 5.2% skip rate, 74.5% shuffle rate.
- **Top Artists Catalog**: Ranked artist cards featuring play counts, hours, catalog track breadth, and skip rates.
- **Interactive Artist Profile Modal**: Inspect any artist to see their total duration, skip rate, and ranked catalog hits.
- **Track Analysis**: Searchable catalog of top tracks with duration, play count, and completion rate.
- **Behavior Analytics Lab**:
  - Stream Completion vs Skip Rate distribution.
  - Shuffle Mode vs Sequential playback breakdown.
  - Platform distribution (`Android`, `Cast to Device`, `iOS`, `Windows`, `Mac`, `Web Player`).
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

## Data Processing

- **Offline Preprocessing Pipeline (`scripts/preprocess_data.py`)**:
  - Audits null values, standardizes date formats, and computes high-order aggregations ahead of time.
  - Removes sensitive customer identifiers and replaces credit card numbers with masked representations (`•••• •••• •••• 1234`).
  - Converts large datasets into compact, pre-indexed JSON payloads in `public/data/`.
- **Pre-Aggregated Summaries**:
  - `transactions_summary.json` (4.5 KB): Fast initial paint for Overview KPIs and charts.
  - `household.json` (546 KB): Complete 2,461 rows and summary aggregations for instant client-side filtering.
  - `spotify_summary.json` (402 KB): Pre-computed catalog of top 100 artists, top 100 tracks, platforms, and behavioral stats.
  - `transactions.json` (3.9 MB): Cleaned transaction rows with asynchronous streaming load to avoid blocking initial render.

---

## Technology Stack

- **Framework**: React 18 / TypeScript / Vite
- **Styling**: Tailwind CSS v4 with custom class-based dark mode
- **Charts**: Recharts (`ResponsiveContainer`, `AreaChart`, `BarChart`, `PieChart`)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## Architecture

LifePulse-Pro follows a modular, feature-first frontend architecture:
```text
src/
├── components/
│   ├── ui/             # Atomic UI elements (Button, Input, Select, Badge, Skeleton)
│   ├── charts/         # Reusable Recharts visualizations
│   ├── tables/         # DataTable and specialized data grids
│   ├── cards/          # StatCard, KpiCard, ReceiptModal
│   ├── filters/        # FilterBar and parameter controls
│   └── layout/         # AppShell, Sidebar, Header, MobileNav, CommandPalette
├── features/
│   ├── overview/       # Multi-lens executive dashboard
│   ├── household/      # Household money and cash flow analytics
│   ├── transactions/   # Transaction explorer, detail drawer, risk center
│   ├── listening/      # Artist catalog, tracks, and listening behavior
│   └── insights/       # Deterministic data insights engine
├── data/               # Data endpoints and API abstractions
├── hooks/              # Custom React hooks (useHousehold, useTransactions, useSpotify, useTheme)
├── utils/              # Pure analytics logic (householdAnalytics, transactionAnalytics, spotifyAnalytics)
├── store/              # Zustand state stores (useUIStore, useFilterStore, useDataStore)
├── types/              # Strict TypeScript models (HouseholdTransaction, TransactionRecord, SpotifyRecord)
└── pages/              # Routed view proxies
```

---

## Accessibility

- **Semantic HTML5**: Full landmark structure with `<header>`, `<nav>`, `<aside>`, `<main id="main-content">`, and `<table>`.
- **Keyboard Navigation**:
  - Visible focus indicators across all interactive buttons and inputs.
  - Global Command Palette accessible via `Cmd + K` / `Ctrl + K`.
  - Full `Escape` key listeners on drawers and modals.
  - Accessible skip link: `Skip to main content`.
- **Color Independence**: Status badges employ distinct iconography alongside color cues (`▲ Fraud`, `● Safe`, `? Unknown`).
- **Screen Reader Support**: Meaningful `aria-label`, `aria-modal="true"`, `role="dialog"`, and `<caption>` elements on data grids.

---

## Responsive Design

- **Mobile First**: Tested and verified across 320px, 375px, 390px, 768px, 1024px, 1280px, and 1440px viewports.
- **Adaptive Navigation**:
  - Desktop: Persistent glassmorphism sidebar with live dataset record counters.
  - Mobile: Fixed bottom navigation bar with quick access to primary lenses, plus a slide-out drawer menu.
- **Dynamic Layouts**:
  - KPI cards scale from single-column on mobile to 4-6 column grids on large screens.
  - Detail drawers adapt to bottom-sheet drawers on small viewports.
  - Horizontal scrolling enabled with custom styled scrollbars for wide financial tables.

---

## Performance

- **Zero-Block Rendering**: Initial dashboard paints immediately using lightweight pre-aggregated summary metadata (under 10 KB).
- **Code Splitting**: Rollup chunk splitting separates `vendor`, `recharts`, and `icons` into isolated bundles.
- **Core Web Vitals**:
  - `rel="preload"` directives for primary analytical JSON endpoints.
  - `font-display: swap` for system typography without layout shifts.
  - Sub-35 KB gzipped application script bundle.
- **Memoized Analytics**: Heavy filtering and sorting calculations memoized via `useMemo` to ensure 60fps UI interactions.

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/iadi01/LifePulse-Pro.git
cd LifePulse-Pro

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Or build and preview production bundle
npm run build
npm run preview
```

Open `http://localhost:5173/` in your browser.

---

## Deployment

LifePulse-Pro is built with a strictly frontend-only architecture designed for immediate zero-config deployment on Vercel:
- **Platform**: Vercel
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: None required (100% client-side execution)

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
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── filters/
│   │   ├── layout/
│   │   ├── tables/
│   │   └── ui/
│   ├── data/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Limitations

- **Domain Decoupling**: The three datasets reflect independent anonymized sources and are intentionally analyzed as separate analytical lenses rather than linked to a single individual.
- **Client Processing Limits**: Very large ad-hoc multi-parameter regex searches on 10,000+ rows execute within browser memory and may depend on client device processing capacity.
