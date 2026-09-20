import React from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  CreditCard,
  Headphones,
  Music,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { KpiCard } from '../../components/common/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { SpendingTrendChart } from '../../components/charts/SpendingTrendChart';
import { RiskDonutChart } from '../../components/charts/RiskDonutChart';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { ListeningTimelineChart } from '../../components/charts/ListeningTimelineChart';
import { KpiSkeleton, ChartSkeleton } from '../../components/ui/Skeleton';
import {
  formatCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercent,
  formatHours
} from '../../lib/formatters';

export const OverviewPage: React.FC = () => {
  const { householdData, transactionSummary, spotifySummary, loading } = useDataStore();
  const { setActiveSection } = useUIStore();
  const { setTxFilter } = useFilterStore();

  const isLoading = loading.household || loading.txSummary || loading.spotify;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Unified Analytical Intelligence
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            LifePulse
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Your data, visualized clearly. Explore patterns across money, transactions and listening behavior.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection('insights')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-xs cursor-pointer"
          >
            Explore Data Insights
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 1: FINANCIAL PERSPECTIVE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Money: Household Financial Activity
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('money')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Full Money Analysis →
          </button>
        </div>

        {isLoading || !householdData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Household Income"
              value={formatCurrency(householdData.summary.total_income)}
              subtitle={`${formatNumber(householdData.summary.total_records)} records logged`}
              icon={Wallet}
              accentColor="emerald"
              actionText="View Income →"
              onClick={() => setActiveSection('money', 'household')}
            />
            <KpiCard
              title="Household Expenses"
              value={formatCurrency(householdData.summary.total_expense)}
              subtitle={`Avg ${formatCurrency(householdData.summary.avg_transaction)} / expense`}
              icon={TrendingDown}
              accentColor="rose"
              actionText="View Expenses →"
              onClick={() => setActiveSection('money', 'spending')}
            />
            <KpiCard
              title="Investment Activity"
              value={formatCurrency(householdData.summary.total_investment)}
              subtitle="Mutual Funds, Shares, Deposits"
              icon={PiggyBank}
              accentColor="indigo"
              actionText="View Investments →"
              onClick={() => setActiveSection('money', 'household')}
            />
            <KpiCard
              title="Net Balance"
              value={formatCurrency(householdData.summary.net_balance)}
              subtitle={householdData.summary.net_balance >= 0 ? 'Surplus cash flow' : 'Deficit cash flow'}
              icon={ReceiptText}
              accentColor={householdData.summary.net_balance >= 0 ? 'emerald' : 'amber'}
              actionText="View Flow →"
              onClick={() => setActiveSection('money', 'spending')}
            />
          </div>
        )}
      </section>

      {/* SECTION 2: RISK & TRANSACTION INTELLIGENCE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Risk: Transaction & Fraud Signals
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('risk')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Full Risk Center →
          </button>
        </div>

        {isLoading || !transactionSummary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Transactions"
              value={formatNumber(transactionSummary.total_transactions)}
              subtitle={`Total volume ${formatCurrency(transactionSummary.total_amount)}`}
              icon={ReceiptText}
              accentColor="slate"
              actionText="Open Explorer →"
              onClick={() => setActiveSection('transactions', 'explorer')}
            />
            <KpiCard
              title="Fraud Alerts"
              value={formatNumber(transactionSummary.fraud_count)}
              subtitle={`Loss volume ${formatCurrency(transactionSummary.total_fraud_amount)}`}
              icon={ShieldAlert}
              badge={{ label: 'Action Required', variant: 'fraud' }}
              accentColor="rose"
              actionText="View transactions →"
              onClick={() => {
                setTxFilter('risk', 'Fraud');
                setActiveSection('transactions', 'risk');
              }}
            />
            <KpiCard
              title="Fraud Rate"
              value={formatPercent(transactionSummary.fraud_rate)}
              subtitle={`${formatNumber(transactionSummary.unknown_count)} unknown signals`}
              icon={AlertOctagon}
              badge={{ label: 'High Risk', variant: 'unknown' }}
              accentColor="amber"
              actionText="Inspect Risks →"
              onClick={() => setActiveSection('risk')}
            />
            <KpiCard
              title="High-Value Transactions"
              value={formatNumber(transactionSummary.high_value_count)}
              subtitle="Transactions ≥ ₹10,000"
              icon={CreditCard}
              accentColor="indigo"
              actionText="Filter High-Value →"
              onClick={() => {
                setTxFilter('minAmount', 10000);
                setActiveSection('transactions', 'explorer');
              }}
            />
          </div>
        )}
      </section>

      {/* SECTION 3: LISTENING INTELLIGENCE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Headphones className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Listening: Spotify Streaming Behavior
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('listening')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Full Listening Lab →
          </button>
        </div>

        {isLoading || !spotifySummary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <KpiSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Total Streams"
              value={formatNumber(spotifySummary.kpis.total_plays)}
              subtitle="11-year verified streaming log"
              icon={Headphones}
              accentColor="emerald"
              actionText="View Timeline →"
              onClick={() => setActiveSection('listening', 'all')}
            />
            <KpiCard
              title="Listening Time"
              value={formatHours(spotifySummary.kpis.total_hours)}
              subtitle="Equivalent to 222+ continuous days"
              icon={Clock}
              accentColor="indigo"
              actionText="View Analytics →"
              onClick={() => setActiveSection('listening', 'behavior')}
            />
            <KpiCard
              title="Unique Artists"
              value={formatNumber(spotifySummary.kpis.unique_artists)}
              subtitle={`Top: ${spotifySummary.top_artists[0]?.artist || 'N/A'}`}
              icon={Users}
              accentColor="slate"
              actionText="View Artists →"
              onClick={() => setActiveSection('listening', 'artists')}
            />
            <KpiCard
              title="Skip Rate"
              value={formatPercent(spotifySummary.kpis.skip_rate)}
              subtitle={`${formatNumber(spotifySummary.kpis.skip_count)} tracks skipped`}
              icon={Music}
              badge={{ label: 'Healthy Completion', variant: 'safe' }}
              accentColor="emerald"
              actionText="Explore Tracks →"
              onClick={() => setActiveSection('listening', 'tracks')}
            />
          </div>
        )}
      </section>

      {/* SECTION 4: OVERVIEW CHARTS GRID */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Visual Analytics Grid
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Spending Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Spending & Financial Overview</CardTitle>
                <CardDescription>
                  Income, expenditure, and investments over time
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || !householdData ? (
                <ChartSkeleton />
              ) : (
                <SpendingTrendChart data={householdData.monthly_trends} />
              )}
            </CardContent>
          </Card>

          {/* Chart 2: Transaction Risk Donut */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Transaction Risk Classification</CardTitle>
                <CardDescription>
                  Segmented fraud distribution across 10,267 India transactions
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || !transactionSummary ? (
                <ChartSkeleton />
              ) : (
                <RiskDonutChart
                  safeCount={transactionSummary.safe_count}
                  fraudCount={transactionSummary.fraud_count}
                  unknownCount={transactionSummary.unknown_count}
                />
              )}
            </CardContent>
          </Card>

          {/* Chart 3: Top Spending Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>
                  Ranked by volume from Daily Household Transactions
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || !householdData ? (
                <ChartSkeleton />
              ) : (
                <CategoryBarChart categories={householdData.categories} limit={6} />
              )}
            </CardContent>
          </Card>

          {/* Chart 4: Listening Activity Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Listening Activity Timeline</CardTitle>
                <CardDescription>
                  Streaming volume and playback hours across 2013 - 2024
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading || !spotifySummary ? (
                <ChartSkeleton />
              ) : (
                <ListeningTimelineChart
                  yearlyData={spotifySummary.timeline_yearly}
                  monthlyData={spotifySummary.timeline_monthly}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
