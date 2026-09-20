import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
  badge?: {
    label: string;
    variant?: 'default' | 'safe' | 'fraud' | 'unknown' | 'indigo';
  };
  actionText?: string;
  onClick?: () => void;
  accentColor?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badge,
  actionText = 'View details →',
  onClick,
  accentColor = 'slate',
  className
}) => {
  const isClickable = Boolean(onClick);

  const iconColors = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden transition-all duration-200 border-slate-200/90 dark:border-slate-800/90 p-5 flex flex-col justify-between',
        isClickable && 'cursor-pointer hover:border-indigo-400/80 dark:hover:border-indigo-500/80 hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400 line-clamp-1">
            {title}
          </span>
          <div className={cn('p-2 rounded-lg transition-transform group-hover:scale-105', iconColors[accentColor])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
            {value}
          </div>
          {badge && (
            <Badge variant={badge.variant || 'default'} className="text-[10px] py-0 px-1.5">
              {badge.label}
            </Badge>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
            {subtitle}
          </p>
        )}
      </div>

      <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {trend ? (
          <span
            className={cn(
              'inline-flex items-center font-medium gap-0.5',
              trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {trend.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend.value}
          </span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Aggregated Metric</span>
        )}

        {isClickable && (
          <span className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform text-[11px]">
            {actionText}
          </span>
        )}
      </div>
    </Card>
  );
};
