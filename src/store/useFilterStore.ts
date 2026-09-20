import { create } from 'zustand';
import { TransactionFilters } from '../types';

interface FilterState {
  // Transaction Filters
  txFilters: TransactionFilters;
  setTxFilter: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
  resetTxFilters: () => void;
  
  // Money Filters
  moneyCategory: string;
  moneyPaymentMode: string;
  moneyType: string;
  moneySearch: string;
  setMoneyCategory: (cat: string) => void;
  setMoneyPaymentMode: (mode: string) => void;
  setMoneyType: (type: string) => void;
  setMoneySearch: (search: string) => void;
  resetMoneyFilters: () => void;

  // Listening Filters
  listeningSearch: string;
  listeningPlatform: string;
  listeningTimePeriod: 'all' | 'year' | 'month';
  setListeningSearch: (search: string) => void;
  setListeningPlatform: (platform: string) => void;
  setListeningTimePeriod: (period: 'all' | 'year' | 'month') => void;
  resetListeningFilters: () => void;
}

const initialTxFilters: TransactionFilters = {
  search: '',
  category: 'All',
  risk: 'All',
  state: 'All',
  minAmount: 0,
  maxAmount: 100000,
  sortBy: 'date',
  sortOrder: 'desc'
};

export const useFilterStore = create<FilterState>((set) => ({
  txFilters: initialTxFilters,
  setTxFilter: (key, value) =>
    set((state) => ({
      txFilters: { ...state.txFilters, [key]: value }
    })),
  resetTxFilters: () => set({ txFilters: initialTxFilters }),

  moneyCategory: 'All',
  moneyPaymentMode: 'All',
  moneyType: 'All',
  moneySearch: '',
  setMoneyCategory: (cat) => set({ moneyCategory: cat }),
  setMoneyPaymentMode: (mode) => set({ moneyPaymentMode: mode }),
  setMoneyType: (type) => set({ moneyType: type }),
  setMoneySearch: (search) => set({ moneySearch: search }),
  resetMoneyFilters: () =>
    set({ moneyCategory: 'All', moneyPaymentMode: 'All', moneyType: 'All', moneySearch: '' }),

  listeningSearch: '',
  listeningPlatform: 'All',
  listeningTimePeriod: 'all',
  setListeningSearch: (search) => set({ listeningSearch: search }),
  setListeningPlatform: (platform) => set({ listeningPlatform: platform }),
  setListeningTimePeriod: (period) => set({ listeningTimePeriod: period }),
  resetListeningFilters: () =>
    set({ listeningSearch: '', listeningPlatform: 'All', listeningTimePeriod: 'all' })
}));
