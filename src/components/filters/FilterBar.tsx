import React from 'react';
import { cn } from '../../lib/utils';

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FilterBar: React.FC<FilterBarProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center', className)} {...props}>
      {children}
    </div>
  );
};
