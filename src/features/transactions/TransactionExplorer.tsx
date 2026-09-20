import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  ArrowUpDown,
  Eye,
  ShieldAlert,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';
import { TransactionRecord } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatNumber, formatDateSafe } from '../../lib/formatters';

export const TransactionExplorer: React.FC = () => {
  const { transactions, loading } = useDataStore();
  const { txFilters, setTxFilter, resetTxFilters } = useFilterStore();
  const { setSelectedTransaction } = useUIStore();

  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Risk filter
      if (txFilters.risk !== 'All' && t.risk !== txFilters.risk) return false;

      // Category filter
      if (txFilters.category !== 'All' && t.category !== txFilters.category) return false;

      // State filter
      if (txFilters.state !== 'All' && t.state !== txFilters.state) return false;

      // Amount filter
      if (t.amount < txFilters.minAmount || t.amount > txFilters.maxAmount) return false;

      // Search query
      if (txFilters.search.trim()) {
        const q = txFilters.search.toLowerCase().trim();
        const matches =
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q) ||
          t.state.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (txFilters.sortBy === 'amount') {
        return txFilters.sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      if (txFilters.sortBy === 'merchant') {
        return txFilters.sortOrder === 'desc'
          ? b.merchant.localeCompare(a.merchant)
          : a.merchant.localeCompare(b.merchant);
      }
      if (txFilters.sortBy === 'risk') {
        return txFilters.sortOrder === 'desc'
          ? b.risk.localeCompare(a.risk)
          : a.risk.localeCompare(b.risk);
      }
      // default: date
      return txFilters.sortOrder === 'desc'
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });
  }, [transactions, txFilters]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * pageSize, page * pageSize);

  // Distinct options
  const distinctCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return ['All', ...Array.from(set).sort()];
  }, [transactions]);

  const distinctStates = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.state));
    return ['All', ...Array.from(set).sort()];
  }, [transactions]);

  const isFiltered =
    Boolean(txFilters.search) ||
    txFilters.category !== 'All' ||
    txFilters.risk !== 'All' ||
    txFilters.state !== 'All' ||
    txFilters.minAmount > 0 ||
    txFilters.maxAmount < 100000;

  if (loading.transactions && transactions.length === 0) {
    return <TableSkeleton rows={12} />;
  }

  return (
    <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle>Transaction Explorer</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length.toLocaleString()} matching records from 10,267 verified transactions
          </CardDescription>
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              resetTxFilters();
              setPage(1);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        )}
      </CardHeader>

      {/* Filter Controls Bar */}
      <div className="px-5 pb-4 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <Input
          icon
          placeholder="Search merchant, city, id..."
          value={txFilters.search}
          onChange={(e) => {
            setTxFilter('search', e.target.value);
            setPage(1);
          }}
          onClear={() => {
            setTxFilter('search', '');
            setPage(1);
          }}
        />

        <Select
          value={txFilters.category}
          onChange={(e) => {
            setTxFilter('category', e.target.value);
            setPage(1);
          }}
        >
          {distinctCategories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </Select>

        <Select
          value={txFilters.risk}
          onChange={(e) => {
            setTxFilter('risk', e.target.value);
            setPage(1);
          }}
        >
          <option value="All">Risk: All Statuses</option>
          <option value="Fraud">▲ Fraud Only</option>
          <option value="Safe">● Safe Only</option>
          <option value="Unknown">? Unknown Only</option>
        </Select>

        <Select
          value={txFilters.state}
          onChange={(e) => {
            setTxFilter('state', e.target.value);
            setPage(1);
          }}
        >
          {distinctStates.map((s) => (
            <option key={s} value={s}>
              State: {s}
            </option>
          ))}
        </Select>

        {/* Amount Range Filter */}
        <Select
          value={`${txFilters.minAmount}-${txFilters.maxAmount}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(Number);
            setTxFilter('minAmount', min);
            setTxFilter('maxAmount', max);
            setPage(1);
          }}
        >
          <option value="0-100000">Amount: All</option>
          <option value="0-2000">Under ₹2,000</option>
          <option value="2000-5000">₹2,000 - ₹5,000</option>
          <option value="5000-10000">₹5,000 - ₹10,000</option>
          <option value="10000-100000">High-Value (≥ ₹10,000)</option>
        </Select>

        {/* Sort Order */}
        <Select
          value={`${txFilters.sortBy}-${txFilters.sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split('-') as [any, any];
            setTxFilter('sortBy', by);
            setTxFilter('sortOrder', order);
            setPage(1);
          }}
        >
          <option value="date-desc">Sort: Date (Newest)</option>
          <option value="date-asc">Sort: Date (Oldest)</option>
          <option value="amount-desc">Sort: Amount (High → Low)</option>
          <option value="amount-asc">Sort: Amount (Low → High)</option>
          <option value="merchant-asc">Sort: Merchant (A → Z)</option>
        </Select>
      </div>

      {/* Table Content */}
      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No transactions match filters"
              description="Try selecting a different risk category, location, or clearing search criteria."
              onAction={() => {
                resetTxFilters();
                setPage(1);
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">ID / Date</th>
                  <th className="px-4 py-3">Merchant</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3 text-center">Risk Signal</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        #{tx.id}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatDateSafe(tx.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {tx.merchant}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {tx.category}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      <div>{tx.city}</div>
                      <div className="text-[10px] text-slate-400">{tx.state}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={
                          tx.risk === 'Fraud'
                            ? 'fraud'
                            : tx.risk === 'Safe'
                            ? 'safe'
                            : 'unknown'
                        }
                        className="text-[11px]"
                      >
                        {tx.risk === 'Fraud' && '▲ Fraud'}
                        {tx.risk === 'Safe' && '● Safe'}
                        {tx.risk === 'Unknown' && '? Unknown'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransaction(tx);
                        }}
                        className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredTransactions.length)} of {filteredTransactions.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
