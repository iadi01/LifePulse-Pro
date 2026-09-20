import React from 'react';
import { Search, Menu, Moon, Sun, Shield, Wallet, Headphones, LayoutDashboard, Receipt } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { ThemeToggle } from '../common/ThemeToggle';
import { NavSection } from '../../types';
import { cn } from '../../lib/utils';

export const Header: React.FC = () => {
  const {
    activeSection,
    subSection,
    setActiveSection,
    setCommandPaletteOpen,
    setReceiptModalOpen,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useUIStore();

  const switchOptions: { id: NavSection; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'All', icon: LayoutDashboard },
    { id: 'money', label: 'Money', icon: Wallet },
    { id: 'risk', label: 'Risk', icon: Shield },
    { id: 'listening', label: 'Listening', icon: Headphones }
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-slate-400 dark:text-slate-500 font-normal">LifePulse</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="capitalize font-semibold text-slate-800 dark:text-slate-100">
            {activeSection}
          </span>
          {subSection && subSection !== 'all' && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="capitalize text-slate-500 dark:text-slate-400">
                {subSection}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Middle: Global Dataset Switcher */}
      <div className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
        {switchOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive =
            activeSection === opt.id ||
            (opt.id === 'risk' && activeSection === 'transactions' && subSection === 'risk');

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveSection(opt.id, 'all')}
              aria-label={`Switch to ${opt.label} lens`}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-white text-indigo-700 font-semibold shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Your Life In Receipts Button */}
        <button
          type="button"
          onClick={() => setReceiptModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
          title="Generate Your Life In Receipts"
          aria-label="Generate Your Life In Receipts"
        >
          <Receipt className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline">Receipts</span>
          <span>🧾</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open search command palette"
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors border border-slate-200/60 dark:border-slate-700/50 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
};
