import React from 'react';
import { cn } from '../../lib/utils';
import { Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, onClear, value, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        )}
        <input
          type={type}
          value={value}
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500',
            icon && 'pl-9',
            onClear && value && 'pr-8',
            className
          )}
          {...props}
        />
        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            aria-label="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
