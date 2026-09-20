import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, id, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          id={id}
          className={cn(
            'appearance-none flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 pr-8 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = 'Select';
