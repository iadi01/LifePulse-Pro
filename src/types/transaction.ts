export type RiskStatus = 'Safe' | 'Fraud' | 'Unknown';

export interface TransactionRecord {
  id: string;
  date: string;
  month: string;
  merchant: string;
  raw_merchant: string;
  category: string;
  amount: number;
  risk: RiskStatus;
  customer: string;
  gender: string;
  job: string;
  city: string;
  state: string;
  lat: number | null;
  long: number | null;
  masked_cc: string;
}

export interface TransactionCategoryStat {
  category: string;
  count: number;
  fraud_count: number;
  fraud_rate: number;
  amount: number;
  fraud_amount: number;
}

export interface TransactionStateStat {
  state: string;
  count: number;
  fraud_count: number;
  fraud_rate: number;
  amount: number;
}

export interface TransactionMonthlyTrend {
  month: string;
  total: number;
  fraud: number;
  safe: number;
  amount: number;
}

export interface TransactionSummary {
  total_transactions: number;
  fraud_count: number;
  safe_count: number;
  unknown_count: number;
  fraud_rate: number;
  total_amount: number;
  avg_amount: number;
  total_fraud_amount: number;
  highest_amount: number;
  high_value_count: number;
  category_stats: TransactionCategoryStat[];
  state_stats: TransactionStateStat[];
  monthly_trends: TransactionMonthlyTrend[];
}

export interface TransactionFilters {
  search: string;
  category: string;
  risk: string;
  state: string;
  minAmount: number;
  maxAmount: number;
  sortBy: 'date' | 'amount' | 'merchant' | 'risk';
  sortOrder: 'asc' | 'desc';
}
