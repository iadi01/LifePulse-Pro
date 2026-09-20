import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { formatNumber, formatPercent } from '../../lib/formatters';

interface RiskDonutProps {
  safeCount: number;
  fraudCount: number;
  unknownCount: number;
}

export const RiskDonutChart: React.FC<RiskDonutProps> = ({
  safeCount,
  fraudCount,
  unknownCount
}) => {
  const { setActiveSection } = useUIStore();
  const { setTxFilter } = useFilterStore();

  const total = safeCount + fraudCount + unknownCount;

  const data = [
    { name: 'Fraud', value: fraudCount, color: '#f43f5e', riskVal: 'Fraud' },
    { name: 'Safe', value: safeCount, color: '#10b981', riskVal: 'Safe' },
    { name: 'Unknown', value: unknownCount, color: '#f59e0b', riskVal: 'Unknown' }
  ];

  const handleClick = (entry: any) => {
    if (entry && entry.riskVal) {
      setTxFilter('risk', entry.riskVal);
      setActiveSection('transactions', 'explorer');
    }
  };

  return (
    <div className="w-full h-72 flex flex-col justify-between">
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              onClick={handleClick}
              className="cursor-pointer outline-none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  className="transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.name} Transactions
                      </div>
                      <div className="mt-1 text-slate-600 dark:text-slate-300">
                        {formatNumber(p.value)} ({formatPercent((p.value / total) * 100)})
                      </div>
                      <div className="mt-1 text-[10px] text-indigo-500 font-medium">
                        Click to view in Explorer →
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatNumber(total)}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Transactions</span>
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        {data.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => handleClick(d)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span>{d.name}</span>
            </div>
            <div className="text-sm font-semibold font-mono text-slate-900 dark:text-white mt-0.5">
              {formatNumber(d.value)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
