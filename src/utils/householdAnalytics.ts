import { HouseholdData, HouseholdCategoryStat, HouseholdPaymentModeStat, HouseholdMonthlyTrend } from '../types/household';

export function getHouseholdIncome(data: HouseholdData | null): number {
  if (!data || !data.summary) return 0;
  return data.summary.total_income;
}

export function getHouseholdExpense(data: HouseholdData | null): number {
  if (!data || !data.summary) return 0;
  return data.summary.total_expense;
}

export function getCategoryBreakdown(data: HouseholdData | null): HouseholdCategoryStat[] {
  if (!data || !data.categories) return [];
  return data.categories;
}

export function getPaymentModeBreakdown(data: HouseholdData | null): HouseholdPaymentModeStat[] {
  if (!data || !data.payment_modes) return [];
  return data.payment_modes;
}

export function getMonthlySpending(data: HouseholdData | null): HouseholdMonthlyTrend[] {
  if (!data || !data.monthly_trends) return [];
  return data.monthly_trends;
}
