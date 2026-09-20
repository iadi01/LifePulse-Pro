import { useDataStore } from '../store/useDataStore';
import { useFilterStore } from '../store/useFilterStore';
import { getHouseholdIncome, getHouseholdExpense, getCategoryBreakdown, getPaymentModeBreakdown, getMonthlySpending } from '../utils/householdAnalytics';

export function useHousehold() {
  const { householdData, loading } = useDataStore();
  const { moneyCategory, moneyPaymentMode, moneyType, moneySearch, setMoneyCategory, setMoneyPaymentMode, setMoneyType, setMoneySearch, resetMoneyFilters } = useFilterStore();

  return {
    data: householdData,
    loading: loading.household,
    income: getHouseholdIncome(householdData),
    expense: getHouseholdExpense(householdData),
    categories: getCategoryBreakdown(householdData),
    paymentModes: getPaymentModeBreakdown(householdData),
    monthlyTrends: getMonthlySpending(householdData),
    filters: {
      category: moneyCategory,
      paymentMode: moneyPaymentMode,
      type: moneyType,
      search: moneySearch
    },
    setCategory: setMoneyCategory,
    setPaymentMode: setMoneyPaymentMode,
    setType: setMoneyType,
    setSearch: setMoneySearch,
    resetFilters: resetMoneyFilters
  };
}
