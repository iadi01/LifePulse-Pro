import React from 'react';
import { Inbox, RefreshCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search query, clearing your filters, or switching data domains.',
  actionText = 'Clear all filters',
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 my-4">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full mb-3">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">{description}</p>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
          {actionText}
        </Button>
      )}
    </div>
  );
};
