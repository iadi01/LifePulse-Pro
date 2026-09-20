import { TransactionRecord, TransactionSummary, TransactionCategoryStat, TransactionStateStat, TransactionFilters } from '../types/transaction';

export function getFraudCount(summary: TransactionSummary | null): number {
  if (!summary) return 0;
  return summary.fraud_count;
}

export function getFraudRate(summary: TransactionSummary | null): number {
  if (!summary) return 0;
  return summary.fraud_rate;
}

export function calculateFraudRate(fraudCount: number, totalEvaluated: number): number {
  if (!totalEvaluated || totalEvaluated === 0) return 0;
  return Number(((fraudCount / totalEvaluated) * 100).toFixed(2));
}

export function getTransactionsByCategory(summary: TransactionSummary | null): TransactionCategoryStat[] {
  if (!summary || !summary.category_stats) return [];
  return summary.category_stats;
}

export function getTransactionsByState(summary: TransactionSummary | null): TransactionStateStat[] {
  if (!summary || !summary.state_stats) return [];
  return summary.state_stats;
}

export function filterTransactions(records: TransactionRecord[], filters: TransactionFilters): TransactionRecord[] {
  if (!records) return [];

  return records.filter((t) => {
    if (filters.risk !== 'All' && t.risk !== filters.risk) return false;
    if (filters.category !== 'All' && t.category !== filters.category) return false;
    if (filters.state !== 'All' && t.state !== filters.state) return false;
    if (t.amount < filters.minAmount || t.amount > filters.maxAmount) return false;
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const match =
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}
