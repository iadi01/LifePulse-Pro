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
import { HouseholdPaymentModeStat } from '../../types';
import { formatCurrency, formatNumber } from '../../lib/formatters';
import { useFilterStore } from '../../store/useFilterStore';
import { useUIStore } from '../../store/useUIStore';

interface PaymentModeChartProps {
  paymentModes: HouseholdPaymentModeStat[];
}

export const PaymentModeChart: React.FC<PaymentModeChartProps> = ({ paymentModes }) => {
  const { setMoneyPaymentMode } = useFilterStore();
  const { setActiveSection } = useUIStore();

  const data = (paymentModes || []).slice(0, 6);

  const handleClick = (entry: any) => {
    if (entry && entry.mode) {
      setMoneyPaymentMode(entry.mode);
      setActiveSection('money', 'household');
    }
  };

  return (
    <div className="w-full h-72 flex flex-col justify-between">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 65, bottom: 5 }}
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
              dataKey="mode"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              width={100}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {p.mode}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 mt-1">
                        Total Volume: <span className="font-mono font-medium">{formatCurrency(p.amount)}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Records: <span className="font-medium">{formatNumber(p.count)}</span>
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
              dataKey="amount"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              onClick={handleClick}
              className="cursor-pointer"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={['#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'][index % 6]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
        Click any payment mode to filter household records
      </div>
    </div>
  );
};
