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
import { HouseholdCategoryStat } from '../../types';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';

interface CategoryBarProps {
  categories: HouseholdCategoryStat[];
  limit?: number;
}

export const CategoryBarChart: React.FC<CategoryBarProps> = ({ categories, limit = 7 }) => {
  const { setActiveSection } = useUIStore();
  const { setMoneyCategory } = useFilterStore();

  const data = (categories || [])
    .filter((c) => c.type === 'Expense' || c.amount > 0)
    .slice(0, limit);

  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316'];

  const handleClick = (entry: any) => {
    if (entry && entry.category) {
      setMoneyCategory(entry.category);
      setActiveSection('money', 'spending');
    }
  };

  return (
    <div className="w-full h-72 flex flex-col justify-between">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 45, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              width={80}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {p.category}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                        Amount: <span className="font-mono font-medium">{formatCurrency(p.amount)}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {formatNumber(p.count)} transactions recorded
                      </div>
                      <div className="mt-1 text-[10px] text-indigo-500 font-medium">
                        Click to view in Money Details →
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              radius={[0, 4, 4, 0]}
              onClick={handleClick}
              className="cursor-pointer"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
        Click any bar to filter household transactions by that category
      </div>
    </div>
  );
};
