import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Wallet,
  ReceiptText,
  ShieldAlert,
  Headphones,
  Sparkles,
  Sun,
  ArrowRight,
  Music,
  User,
  CreditCard
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { useFilterStore } from '../../store/useFilterStore';
import { formatCurrency } from '../../lib/formatters';

interface PaletteItem {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveSection,
    toggleTheme,
    setSelectedTransaction,
    setSelectedArtist
  } = useUIStore();
  const { transactions, spotifySummary } = useDataStore();
  const { setTxFilter } = useFilterStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Build navigation items
  const navActions: PaletteItem[] = [
    {
      id: 'nav-overview',
      type: 'Navigation',
      title: 'Open Overview Dashboard',
      icon: LayoutDashboard,
      action: () => {
        setActiveSection('overview');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'nav-money',
      type: 'Navigation',
      title: 'Open Money & Household Finances',
      icon: Wallet,
      action: () => {
        setActiveSection('money');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'nav-transactions',
      type: 'Navigation',
      title: 'Open Transaction Explorer',
      icon: ReceiptText,
      action: () => {
        setActiveSection('transactions', 'explorer');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'nav-risk',
      type: 'Navigation',
      title: 'Open Fraud & Risk Dashboard',
      icon: ShieldAlert,
      action: () => {
        setActiveSection('risk');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'nav-listening',
      type: 'Navigation',
      title: 'Open Spotify Listening Intelligence',
      icon: Headphones,
      action: () => {
        setActiveSection('listening');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'nav-insights',
      type: 'Navigation',
      title: 'Open Deterministic Insights',
      icon: Sparkles,
      action: () => {
        setActiveSection('insights');
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action-theme',
      type: 'Preference',
      title: 'Toggle Dark / Light Theme',
      icon: Sun,
      action: () => {
        toggleTheme();
        setCommandPaletteOpen(false);
      }
    },
    {
      id: 'action-fraud-filter',
      type: 'Filter',
      title: 'Filter Transactions: Show Fraud-marked Only',
      icon: ShieldAlert,
      action: () => {
        setTxFilter('risk', 'Fraud');
        setActiveSection('transactions', 'explorer');
        setCommandPaletteOpen(false);
      }
    }
  ];

  // Dynamic search results for query
  const q = query.toLowerCase().trim();

  const matchedNav: PaletteItem[] = q
    ? navActions.filter((a) => a.title.toLowerCase().includes(q))
    : navActions;

  // Search transactions
  const matchedTransactions: PaletteItem[] = q && transactions.length > 0
    ? transactions
        .filter(
          (t) =>
            t.merchant.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.city.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((t) => ({
          id: `tx-${t.id}`,
          type: 'Transaction',
          title: `${t.merchant} (${formatCurrency(t.amount)})`,
          subtitle: `${t.category} • ${t.city} • ${t.risk}`,
          icon: CreditCard,
          action: () => {
            setSelectedTransaction(t);
            setActiveSection('transactions', 'explorer');
            setCommandPaletteOpen(false);
          }
        }))
    : [];

  // Search Spotify Artists
  const matchedArtists: PaletteItem[] = q && spotifySummary
    ? spotifySummary.top_artists
        .filter((a) => a.artist.toLowerCase().includes(q))
        .slice(0, 4)
        .map((a) => ({
          id: `art-${a.artist}`,
          type: 'Artist',
          title: a.artist,
          subtitle: `${a.plays.toLocaleString()} plays • ${a.hours} hrs`,
          icon: User,
          action: () => {
            setSelectedArtist(a);
            setActiveSection('listening', 'artists');
            setCommandPaletteOpen(false);
          }
        }))
    : [];

  // Search Spotify Tracks
  const matchedTracks: PaletteItem[] = q && spotifySummary
    ? spotifySummary.top_tracks
        .filter(
          (tr) =>
            tr.track.toLowerCase().includes(q) || tr.artist.toLowerCase().includes(q)
        )
        .slice(0, 4)
        .map((tr) => ({
          id: `trk-${tr.track}`,
          type: 'Track',
          title: tr.track,
          subtitle: `by ${tr.artist} • ${tr.plays} plays`,
          icon: Music,
          action: () => {
            setActiveSection('listening', 'tracks');
            setCommandPaletteOpen(false);
          }
        }))
    : [];

  const allResults: PaletteItem[] = [...matchedNav, ...matchedTransactions, ...matchedArtists, ...matchedTracks];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].action();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search transactions, artists, tracks..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching commands or records found for "{query}".
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      {item.subtitle && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </span>
                    {isSelected && <ArrowRight className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with ↑ and ↓</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
