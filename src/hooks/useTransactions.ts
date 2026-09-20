import { useDataStore } from '../store/useDataStore';
import { useFilterStore } from '../store/useFilterStore';
import { getFraudCount, getFraudRate, getTransactionsByCategory, getTransactionsByState, filterTransactions } from '../utils/transactionAnalytics';

export function useTransactions() {
  const { transactions, transactionSummary, loading, fetchFullTransactions } = useDataStore();
  const { txFilters, setTxFilter, resetTxFilters } = useFilterStore();

  const filtered = filterTransactions(transactions, txFilters);

  return {
    transactions,
    filteredTransactions: filtered,
    summary: transactionSummary,
    loading: loading.transactions || loading.txSummary,
    fraudCount: getFraudCount(transactionSummary),
    fraudRate: getFraudRate(transactionSummary),
    categories: getTransactionsByCategory(transactionSummary),
    states: getTransactionsByState(transactionSummary),
    filters: txFilters,
    setFilter: setTxFilter,
    resetFilters: resetTxFilters,
    loadFull: fetchFullTransactions
  };
}
