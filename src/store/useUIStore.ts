import { create } from 'zustand';
import { NavSection, TransactionRecord, SpotifyArtist } from '../types';

interface UIState {
  activeSection: NavSection;
  subSection: string;
  theme: 'light' | 'dark';
  commandPaletteOpen: boolean;
  selectedTransaction: TransactionRecord | null;
  selectedArtist: SpotifyArtist | null;
  isMobileNavOpen: boolean;
  
  setActiveSection: (section: NavSection, subSection?: string) => void;
  setSubSection: (subSection: string) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSelectedTransaction: (tx: TransactionRecord | null) => void;
  setSelectedArtist: (artist: SpotifyArtist | null) => void;
  setIsMobileNavOpen: (open: boolean) => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lifepulse-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  }
  return 'light';
};

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'overview',
  subSection: 'all',
  theme: getInitialTheme(),
  commandPaletteOpen: false,
  selectedTransaction: null,
  selectedArtist: null,
  isMobileNavOpen: false,

  setActiveSection: (section, subSection = 'all') => {
    set({ activeSection: section, subSection, isMobileNavOpen: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  setSubSection: (subSection) => set({ subSection }),

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifepulse-theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { theme: nextTheme };
  }),

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifepulse-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setSelectedTransaction: (tx) => set({ selectedTransaction: tx }),
  setSelectedArtist: (artist) => set({ selectedArtist: artist }),
  setIsMobileNavOpen: (open) => set({ isMobileNavOpen: open })
}));
