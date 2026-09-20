import React, { useEffect } from 'react';
import {
  ReceiptText,
  ShieldAlert,
  TableProperties
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { TransactionExplorer } from './TransactionExplorer';
import { RiskDashboard } from './RiskDashboard';
import { KpiCard } from '../../components/common/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { RiskDonutChart } from '../../components/charts/RiskDonutChart';
import { FraudCategoryChart } from '../../components/charts/FraudCategoryChart';
import { KpiSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatNumber } from '../../lib/formatters';

export const TransactionsPage: React.FC = () => {
  const { subSection, setSubSection } = useUIStore();
  const { transactionSummary, loading, fetchFullTransactions } = useDataStore();

  useEffect(() => {
    fetchFullTransactions();
  }, [fetchFullTransactions]);

  const activeTab = subSection === 'risk' ? 'risk' : subSection === 'explorer' ? 'explorer' : 'overview';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Transaction Intelligence Lens
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Transactions & Risk Intelligence
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Explore 10,267 verified India transactions, fraud alerts, and merchant patterns.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start">
          <button
            type="button"
            onClick={() => setSubSection('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ReceiptText className="h-3.5 w-3.5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setSubSection('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'explorer'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <TableProperties className="h-3.5 w-3.5" />
            Explorer
          </button>
          <button
            type="button"
            onClick={() => setSubSection('risk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'risk'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            Risk & Fraud
          </button>
        </div>
      </div>

      {/* Render sub-view */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading.txSummary || !transactionSummary ? (
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
                subtitle="All logged records"
                icon={ReceiptText}
                accentColor="slate"
                actionText="Explore Table →"
                onClick={() => setSubSection('explorer')}
              />
              <KpiCard
                title="Fraud-Marked"
                value={formatNumber(transactionSummary.fraud_count)}
                subtitle="5,046 flagged items"
                icon={ShieldAlert}
                badge={{ label: 'Alerts', variant: 'fraud' }}
                accentColor="rose"
                actionText="Analyze Fraud →"
                onClick={() => setSubSection('risk')}
              />
              <KpiCard
                title="Safe Transactions"
                value={formatNumber(transactionSummary.safe_count)}
                subtitle="4,576 legitimate purchases"
                icon={ReceiptText}
                accentColor="emerald"
                actionText="View Safe →"
                onClick={() => setSubSection('explorer')}
              />
              <KpiCard
                title="Total Amount"
                value={formatCurrency(transactionSummary.total_amount)}
                subtitle={`Avg ${formatCurrency(transactionSummary.avg_amount)}`}
                icon={ReceiptText}
                accentColor="indigo"
                actionText="View Amounts →"
                onClick={() => setSubSection('explorer')}
              />
            </div>
          )}

          {transactionSummary && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Status Breakdown</CardTitle>
                  <CardDescription>
                    Safe, Fraud, and strictly retained Unknown records
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

              <Card>
                <CardHeader>
                  <CardTitle>Top Fraud Categories</CardTitle>
                  <CardDescription>
                    Merchant categories displaying the highest incident rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FraudCategoryChart categories={transactionSummary.category_stats} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick preview of Explorer */}
          <div className="pt-2">
            <TransactionExplorer />
          </div>
        </div>
      )}

      {activeTab === 'explorer' && <TransactionExplorer />}

      {activeTab === 'risk' && <RiskDashboard />}
    </div>
  );
};
