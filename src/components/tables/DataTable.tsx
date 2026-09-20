import React from 'react';
import { cn } from '../../lib/utils';

export interface DataTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  caption?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ className, children, caption, ...props }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className={cn('w-full text-left text-xs border-collapse', className)} {...props}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
};
