import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ThemeToggle: React.FC<{ showLabel?: boolean }> = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useUIStore();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      <div className="relative h-4 w-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 scale-100" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 transition-transform rotate-0 scale-100" />
        )}
      </div>
      <span className="text-xs font-semibold select-none">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};
