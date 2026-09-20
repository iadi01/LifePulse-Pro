import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { HouseholdMonthlyTrend } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { cn } from '../../lib/utils';

interface SpendingTrendProps {
  data: HouseholdMonthlyTrend[];
}

export const SpendingTrendChart: React.FC<SpendingTrendProps> = ({ data }) => {
  const [period, setPeriod] = useState<'7D' | '30D' | '90D' | 'All'>('All');

  // Household data is monthly: filter accordingly
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (period === '7D') return data.slice(-2);
    if (period === '30D') return data.slice(-4);
    if (period === '90D') return data.slice(-8);
    return data;
  }, [data, period]);

  return (
    <div className="w-full flex flex-col h-80">
      {/* Controls */}
      <div className="flex items-center justify-between pb-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing {filteredData.length} timeline periods
        </div>
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          {(['7D', '30D', '90D', 'All'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer',
                period === p
                  ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 min-w-[160px]">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-1">
                        {label}
                      </div>
                      {payload.map((entry: any) => (
                        <div key={entry.name} className="flex justify-between items-center gap-4">
                          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 capitalize">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}
                          </span>
                          <span className="font-mono font-medium text-slate-800 dark:text-slate-100">
                            {formatCurrency(entry.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', textTransform: 'capitalize' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
            <Area
              type="monotone"
              dataKey="investment"
              name="Investment"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInvest)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
