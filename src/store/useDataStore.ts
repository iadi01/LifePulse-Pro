import { create } from 'zustand';
import {
  HouseholdData,
  TransactionSummary,
  TransactionRecord,
  SpotifySummaryData
} from '../types';

interface DataState {
  householdData: HouseholdData | null;
  transactionSummary: TransactionSummary | null;
  transactions: TransactionRecord[];
  spotifySummary: SpotifySummaryData | null;
  
  loading: {
    household: boolean;
    txSummary: boolean;
    transactions: boolean;
    spotify: boolean;
  };
  error: string | null;

  fetchInitialData: () => Promise<void>;
  fetchFullTransactions: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  householdData: null,
  transactionSummary: null,
  transactions: [],
  spotifySummary: null,
  loading: {
    household: true,
    txSummary: true,
    transactions: false,
    spotify: true
  },
  error: null,

  fetchInitialData: async () => {
    try {
      // 1. Fetch household and summaries simultaneously
      const [hhRes, txSumRes, spRes] = await Promise.all([
        fetch('/data/household.json'),
        fetch('/data/transactions_summary.json'),
        fetch('/data/spotify_summary.json')
      ]);

      if (!hhRes.ok || !txSumRes.ok || !spRes.ok) {
        throw new Error('Failed to load analytical datasets');
      }

      const [hhData, txSumData, spData] = await Promise.all([
        hhRes.json(),
        txSumRes.json(),
        spRes.json()
      ]);

      set({
        householdData: hhData,
        transactionSummary: txSumData,
        spotifySummary: spData,
        loading: {
          ...get().loading,
          household: false,
          txSummary: false,
          spotify: false
        }
      });

      // Eagerly trigger full transactions load in background
      get().fetchFullTransactions();
    } catch (err: any) {
      console.error('Error loading initial datasets:', err);
      set({
        error: err.message || 'Error loading datasets',
        loading: {
          household: false,
          txSummary: false,
          transactions: false,
          spotify: false
        }
      });
    }
  },

  fetchFullTransactions: async () => {
    if (get().transactions.length > 0 || get().loading.transactions) return;
    
    set((state) => ({
      loading: { ...state.loading, transactions: true }
    }));

    try {
      const res = await fetch('/data/transactions.json');
      if (!res.ok) throw new Error('Failed to load transaction records');
      const data = await res.json();
      set((state) => ({
        transactions: data.records || [],
        loading: { ...state.loading, transactions: false }
      }));
    } catch (err: any) {
      console.error('Error loading full transactions:', err);
      set((state) => ({
        loading: { ...state.loading, transactions: false }
      }));
    }
  }
}));
