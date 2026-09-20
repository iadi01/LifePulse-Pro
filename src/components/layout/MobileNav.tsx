import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  ReceiptText,
  ShieldAlert,
  Headphones,
  Sparkles,
  X
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { NavSection } from '../../types';
import { cn } from '../../lib/utils';

export const MobileNav: React.FC = () => {
  const {
    activeSection,
    subSection,
    setActiveSection,
    isMobileNavOpen,
    setIsMobileNavOpen
  } = useUIStore();

  const primaryTabs: { id: NavSection; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'money', label: 'Money', icon: Wallet },
    { id: 'transactions', label: 'Tx', icon: ReceiptText },
    { id: 'risk', label: 'Risk', icon: ShieldAlert },
    { id: 'listening', label: 'Audio', icon: Headphones },
    { id: 'insights', label: 'Insights', icon: Sparkles }
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id, 'all')}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors cursor-pointer',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Drawer Overlay */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 z-50 p-5 shadow-2xl flex flex-col transition-transform duration-300 md:hidden',
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center">
              LP
            </div>
            <div className="font-bold text-slate-900 dark:text-white">LifePulse</div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-1 overflow-y-auto flex-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Sections
          </div>
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id, 'all')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <div className="font-medium text-slate-700 dark:text-slate-300">LifePulse v1.0</div>
          <div>WebRush 2026 Hackathon</div>
        </div>
      </div>
    </>
  );
};
