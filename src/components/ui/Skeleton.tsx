import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80',
        className
      )}
      {...props}
    />
  );
};

export const KpiSkeleton: React.FC = () => (
  <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-7 w-7 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-32" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-72' }) => (
  <div className={cn('rounded-xl border border-slate-200 p-5 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between', height)}>
    <div className="space-y-2">
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-3 w-64" />
    </div>
    <div className="flex items-end gap-3 h-44 pt-4 px-2">
      <Skeleton className="h-20 flex-1 rounded-t" />
      <Skeleton className="h-32 flex-1 rounded-t" />
      <Skeleton className="h-24 flex-1 rounded-t" />
      <Skeleton className="h-40 flex-1 rounded-t" />
      <Skeleton className="h-28 flex-1 rounded-t" />
      <Skeleton className="h-36 flex-1 rounded-t" />
      <Skeleton className="h-16 flex-1 rounded-t" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-48" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20 ml-auto" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);
