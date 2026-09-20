export interface HouseholdRecord {
  id: string;
  date: string;
  month: string;
  mode: string;
  category: string;
  subcategory: string;
  note: string;
  amount: number;
  type: 'Expense' | 'Income' | 'Transfer-Out' | string;
  currency: string;
  is_investment: boolean;
}

export interface HouseholdCategoryStat {
  category: string;
  count: number;
  amount: number;
  type: string;
}

export interface HouseholdPaymentModeStat {
  mode: string;
  count: number;
  amount: number;
}

export interface HouseholdMonthlyTrend {
  month: string;
  income: number;
  expense: number;
  investment: number;
}

export interface HouseholdSummary {
  total_income: number;
  total_expense: number;
  total_investment: number;
  net_balance: number;
  total_records: number;
  avg_transaction: number;
}

export interface HouseholdData {
  summary: HouseholdSummary;
  categories: HouseholdCategoryStat[];
  payment_modes: HouseholdPaymentModeStat[];
  monthly_trends: HouseholdMonthlyTrend[];
  records: HouseholdRecord[];
}
