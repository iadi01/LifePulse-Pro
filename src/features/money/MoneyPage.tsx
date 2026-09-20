import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Receipt,
  Layers,
  Filter,
  Search,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { useFilterStore } from '../../store/useFilterStore';
import { KpiCard } from '../../components/common/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { SpendingTrendChart } from '../../components/charts/SpendingTrendChart';
import { CategoryBarChart } from '../../components/charts/CategoryBarChart';
import { PaymentModeChart } from '../../components/charts/PaymentModeChart';
import { EmptyState } from '../../components/common/EmptyState';
import { KpiSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatNumber, formatDateSafe } from '../../lib/formatters';

export const MoneyPage: React.FC = () => {
  const { householdData, loading } = useDataStore();
  const {
    moneyCategory,
    moneyPaymentMode,
    moneyType,
    moneySearch,
    setMoneyCategory,
    setMoneyPaymentMode,
    setMoneyType,
    setMoneySearch,
    resetMoneyFilters
  } = useFilterStore();

  const [comparisonMode, setComparisonMode] = useState<'monthly' | 'category' | 'mode'>('monthly');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter household records
  const filteredRecords = useMemo(() => {
    if (!householdData?.records) return [];

    return householdData.records.filter((r) => {
      if (moneyCategory !== 'All' && r.category !== moneyCategory) return false;
      if (moneyPaymentMode !== 'All' && r.mode !== moneyPaymentMode) return false;
      if (moneyType !== 'All' && r.type !== moneyType) return false;
      if (moneySearch.trim()) {
        const q = moneySearch.toLowerCase().trim();
        const matches =
          r.category.toLowerCase().includes(q) ||
          r.subcategory.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q) ||
          r.mode.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [householdData, moneyCategory, moneyPaymentMode, moneyType, moneySearch]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic filtered summary
  const dynamicSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    let investment = 0;

    for (const r of filteredRecords) {
      if (r.type === 'Income') income += r.amount;
      else {
        expense += r.amount;
        if (r.is_investment) investment += r.amount;
      }
    }

    return {
      income,
      expense,
      investment,
      net: income - expense,
      count: filteredRecords.length,
      avg: expense / Math.max(1, filteredRecords.length)
    };
  }, [filteredRecords]);

  if (loading.household || !householdData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  const distinctCategories = ['All', ...householdData.categories.map((c) => c.category)];
  const distinctModes = ['All', ...householdData.payment_modes.map((m) => m.mode)];
  const distinctTypes = ['All', 'Expense', 'Income', 'Transfer-Out'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Financial Intelligence Lens
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Money
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Understand household financial activity, recurring cash flows, and category expenditures.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Income"
          value={formatCurrency(dynamicSummary.income)}
          subtitle="Household earnings"
          icon={Wallet}
          accentColor="emerald"
        />
        <KpiCard
          title="Total Expenses"
          value={formatCurrency(dynamicSummary.expense)}
          subtitle="Direct outflows"
          icon={TrendingDown}
          accentColor="rose"
        />
        <KpiCard
          title="Total Investment"
          value={formatCurrency(dynamicSummary.investment)}
          subtitle="Funds, shares, deposits"
          icon={PiggyBank}
          accentColor="indigo"
        />
        <KpiCard
          title="Avg Transaction"
          value={formatCurrency(dynamicSummary.avg)}
          subtitle="Per expenditure item"
          icon={Receipt}
          accentColor="slate"
        />
        <KpiCard
          title="Number of Records"
          value={formatNumber(dynamicSummary.count)}
          subtitle={`Filtered from ${formatNumber(householdData.summary.total_records)}`}
          icon={Layers}
          accentColor="slate"
        />
      </div>

      {/* Income vs Expense Comparison Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
          <div>
            <CardTitle>Income vs Expense Analysis</CardTitle>
            <CardDescription>
              Compare inflows against outflows by time period, spending category, or payment mode
            </CardDescription>
          </div>
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start">
            <button
              type="button"
              onClick={() => setComparisonMode('monthly')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                comparisonMode === 'monthly'
                  ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly Trend
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('category')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                comparisonMode === 'category'
                  ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              By Category
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('mode')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
                comparisonMode === 'mode'
                  ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              By Payment Mode
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {comparisonMode === 'monthly' && (
            <SpendingTrendChart data={householdData.monthly_trends} />
          )}
          {comparisonMode === 'category' && (
            <CategoryBarChart categories={householdData.categories} limit={10} />
          )}
          {comparisonMode === 'mode' && (
            <PaymentModeChart paymentModes={householdData.payment_modes} />
          )}
        </CardContent>
      </Card>

      {/* Interactive Records Explorer */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Household Transaction Records</CardTitle>
            <CardDescription>
              Showing {filteredRecords.length} matching rows with complete audit metadata
            </CardDescription>
          </div>
          {(moneyCategory !== 'All' || moneyPaymentMode !== 'All' || moneyType !== 'All' || moneySearch) && (
            <button
              type="button"
              onClick={resetMoneyFilters}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset all money filters
            </button>
          )}
        </CardHeader>

        {/* Filter Controls Bar */}
        <div className="px-5 pb-4 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            icon
            placeholder="Search note, category, date..."
            value={moneySearch}
            onChange={(e) => {
              setMoneySearch(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setMoneySearch('');
              setCurrentPage(1);
            }}
          />

          <Select
            value={moneyCategory}
            onChange={(e) => {
              setMoneyCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            {distinctCategories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </Select>

          <Select
            value={moneyPaymentMode}
            onChange={(e) => {
              setMoneyPaymentMode(e.target.value);
              setCurrentPage(1);
            }}
          >
            {distinctModes.map((mode) => (
              <option key={mode} value={mode}>
                Mode: {mode}
              </option>
            ))}
          </Select>

          <Select
            value={moneyType}
            onChange={(e) => {
              setMoneyType(e.target.value);
              setCurrentPage(1);
            }}
          >
            {distinctTypes.map((t) => (
              <option key={t} value={t}>
                Type: {t}
              </option>
            ))}
          </Select>
        </div>

        {/* Records Table */}
        <CardContent className="p-0">
          {filteredRecords.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No household records found"
                description="No transactions match your current search and filter criteria."
                onAction={resetMoneyFilters}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Subcategory / Note</th>
                    <th className="px-4 py-3">Payment Mode</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {paginatedRecords.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                        {formatDateSafe(r.date)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {r.category}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        <div className="font-normal text-slate-700 dark:text-slate-300">
                          {r.note !== 'No note' ? r.note : r.subcategory}
                        </div>
                        {r.subcategory !== 'None' && r.note !== 'No note' && (
                          <div className="text-[10px] text-slate-400">{r.subcategory}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.mode}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-mono font-semibold whitespace-nowrap ${
                          r.type === 'Income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {formatCurrency(r.amount, r.currency === 'INR' ? '₹' : `${r.currency} `)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            r.type === 'Income'
                              ? 'safe'
                              : r.is_investment
                              ? 'indigo'
                              : 'default'
                          }
                          className="text-[10px]"
                        >
                          {r.type}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div>
                Page {currentPage} of {totalPages} ({filteredRecords.length} records)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
