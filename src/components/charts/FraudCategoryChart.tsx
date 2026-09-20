import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TransactionCategoryStat } from '../../types';
import { formatNumber, formatPercent } from '../../lib/formatters';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';

interface FraudCategoryProps {
  categories: TransactionCategoryStat[];
}

export const FraudCategoryChart: React.FC<FraudCategoryProps> = ({ categories }) => {
  const { setActiveSection } = useUIStore();
  const { setTxFilter } = useFilterStore();

  const data = (categories || []).slice(0, 5);

  const handleClick = (entry: any) => {
    if (entry && entry.category) {
      setTxFilter('category', entry.category);
      setTxFilter('risk', 'Fraud');
      setActiveSection('transactions', 'explorer');
    }
  };

  return (
    <div className="w-full h-72 flex flex-col justify-between">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              width={95}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-semibold text-rose-600 dark:text-rose-400">
                        {p.category}
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 mt-1">
                        Fraud Count: <span className="font-mono font-medium">{formatNumber(p.fraud_count)}</span> / {formatNumber(p.count)}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Fraud Rate: <span className="font-medium text-rose-500">{formatPercent(p.fraud_rate)}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-indigo-500 font-medium">
                        Click to filter transactions →
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="fraud_count"
              fill="#f43f5e"
              radius={[0, 4, 4, 0]}
              onClick={handleClick}
              className="cursor-pointer hover:opacity-90"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
        Click a bar to view fraud transactions in that category
      </div>
    </div>
  );
};
