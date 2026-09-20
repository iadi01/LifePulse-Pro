import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  ShieldAlert,
  Headphones,
  Sparkles,
  Search,
  ExternalLink,
  ReceiptText
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { NavSection } from '../../types';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { activeSection, subSection, setActiveSection, setCommandPaletteOpen } = useUIStore();

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ElementType;
    badge?: string;
    subItems?: { id: string; label: string }[];
  }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'money',
      label: 'Money',
      icon: Wallet,
      badge: '2.4k',
      subItems: [
        { id: 'all', label: 'All Money' },
        { id: 'household', label: 'Household' },
        { id: 'spending', label: 'Spending Breakdown' }
      ]
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: ReceiptText,
      badge: '10.2k',
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'explorer', label: 'Explorer' },
        { id: 'risk', label: 'Risk Analysis' }
      ]
    },
    {
      id: 'risk',
      label: 'Risk Intelligence',
      icon: ShieldAlert,
      badge: '5,046'
    },
    {
      id: 'listening',
      label: 'Listening',
      icon: Headphones,
      badge: '149.8k',
      subItems: [
        { id: 'all', label: 'Overview' },
        { id: 'artists', label: 'Top Artists' },
        { id: 'tracks', label: 'Top Tracks' },
        { id: 'behavior', label: 'Behavior' }
      ]
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: Sparkles
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-screen sticky top-0 z-30 select-none">
      {/* Brand */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => setActiveSection('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            LP
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              LifePulse
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              3-Perspective Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Shortcut */}
      <div className="px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/60 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            Quick Command...
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Analytical Domains
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveSection(item.id, 'all')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold',
                      isActive
                        ? 'bg-indigo-200/60 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Sub-items if active */}
              {isActive && item.subItems && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSection(item.id, sub.id);
                      }}
                      className={cn(
                        'w-full text-left px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer',
                        subSection === sub.id
                          ? 'text-indigo-700 bg-indigo-100/50 dark:text-indigo-300 dark:bg-indigo-900/40 font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      )}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Dataset Attribution Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
          <span>Verified Datasets</span>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </div>
        <div className="text-[11px] leading-tight space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">Household</span>
            <span className="font-mono text-slate-400">2,461 rows</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">Transactions</span>
            <span className="font-mono text-slate-400">10,267 rows</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-300">Spotify Logs</span>
            <span className="font-mono text-slate-400">149,860 rows</span>
          </div>
        </div>
        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/60">
          Strictly frontend-only client architecture.
        </div>
      </div>
    </aside>
  );
};
