import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useDataStore } from '../../store/useDataStore';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';
import { KpiCard } from '../../components/common/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { FraudCategoryChart } from '../../components/charts/FraudCategoryChart';
import { RiskDonutChart } from '../../components/charts/RiskDonutChart';
import { KpiSkeleton, ChartSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/formatters';

export const RiskDashboard: React.FC = () => {
  const { transactionSummary, loading } = useDataStore();
  const { setTxFilter } = useFilterStore();
  const { setActiveSection } = useUIStore();

  const [timeResolution, setTimeResolution] = useState<'monthly' | 'daily'>('monthly');

  if (loading.txSummary || !transactionSummary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  const handleStateClick = (stateName: string) => {
    setTxFilter('state', stateName);
    setTxFilter('risk', 'Fraud');
    setActiveSection('transactions', 'explorer');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Risk Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Risk & Fraud Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Fraud & Risk Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Empirical risk signals, anomalous transaction volumes, and vulnerable geographic vectors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTxFilter('risk', 'Fraud');
            setActiveSection('transactions', 'explorer');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-xs cursor-pointer self-start"
        >
          View All 5,046 Fraud Records
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Risk Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Fraud-Marked Alerts"
          value={formatNumber(transactionSummary.fraud_count)}
          subtitle={`${formatPercent(transactionSummary.fraud_rate)} of evaluated records`}
          icon={ShieldAlert}
          accentColor="rose"
          actionText="Inspect Records →"
          onClick={() => {
            setTxFilter('risk', 'Fraud');
            setActiveSection('transactions', 'explorer');
          }}
        />
        <KpiCard
          title="Unknown Status Signals"
          value={formatNumber(transactionSummary.unknown_count)}
          subtitle="Unclassified missing values"
          icon={AlertTriangle}
          accentColor="amber"
          actionText="Inspect Unknown →"
          onClick={() => {
            setTxFilter('risk', 'Unknown');
            setActiveSection('transactions', 'explorer');
          }}
        />
        <KpiCard
          title="Fraud Exposure Volume"
          value={formatCurrency(transactionSummary.total_fraud_amount)}
          subtitle="Total at-risk transaction capital"
          icon={Flame}
          accentColor="rose"
          actionText="View Exposure →"
          onClick={() => {
            setTxFilter('risk', 'Fraud');
            setActiveSection('transactions', 'explorer');
          }}
        />
        <KpiCard
          title="Highest Transaction Amount"
          value={formatCurrency(transactionSummary.highest_amount)}
          subtitle="Peak single transaction value"
          icon={TrendingUp}
          accentColor="indigo"
          actionText="Filter High Value →"
          onClick={() => {
            setTxFilter('minAmount', 10000);
            setActiveSection('transactions', 'explorer');
          }}
        />
      </div>

      {/* Main Grid: Fraud by Category & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Activity by Merchant Category</CardTitle>
            <CardDescription>
              Ranked count of confirmed fraudulent transactions by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FraudCategoryChart categories={transactionSummary.category_stats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Status Distribution</CardTitle>
            <CardDescription>
              Safe (4,576), Fraud (5,046), and strictly audited Unknown (645)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDonutChart
              safeCount={transactionSummary.safe_count}
              fraudCount={transactionSummary.fraud_count}
              unknownCount={transactionSummary.unknown_count}
            />
          </CardContent>
        </Card>
      </div>

      {/* Fraud Activity Over Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Fraud Activity Over Time</CardTitle>
            <CardDescription>
              Temporal distribution of fraud events vs safe transactions
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            <span>Recorded 2023 - 2024</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionSummary.monthly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fraudGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="safeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                          <div className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1">
                            {label}
                          </div>
                          <div className="text-rose-600 font-medium">
                            Fraud Alerts: {payload.find((p: any) => p.dataKey === 'fraud')?.value || 0}
                          </div>
                          <div className="text-emerald-600 font-medium">
                            Safe Transactions: {payload.find((p: any) => p.dataKey === 'safe')?.value || 0}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="fraud" stroke="#f43f5e" strokeWidth={2} fill="url(#fraudGradient)" />
                <Area type="monotone" dataKey="safe" stroke="#10b981" strokeWidth={2} fill="url(#safeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fraud by Location (Indian States) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-600" />
            <CardTitle>Geographic Fraud Dispersion (Top Indian States)</CardTitle>
          </div>
          <CardDescription>
            Clicking a state bar filters the explorer to review flagged merchants in that region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transactionSummary.state_stats.slice(0, 10)}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis
                  dataKey="state"
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                  tick={{ fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="font-semibold text-slate-900 dark:text-white">{p.state}</div>
                          <div className="text-slate-600 dark:text-slate-300 mt-1">
                            Fraud Count: <span className="font-mono font-bold text-rose-600">{p.fraud_count}</span> / {p.count}
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            Fraud Rate: {formatPercent(p.fraud_rate)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="fraud_count"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer hover:opacity-85"
                  onClick={(entry) => {
                    if (entry && entry.state) handleStateClick(entry.state);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Click any state to filter transactions by that region
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
