import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { SpotifyTimelinePoint } from '../../types';
import { formatNumber } from '../../lib/formatters';
import { cn } from '../../lib/utils';

interface ListeningTimelineProps {
  yearlyData: SpotifyTimelinePoint[];
  monthlyData: SpotifyTimelinePoint[];
}

export const ListeningTimelineChart: React.FC<ListeningTimelineProps> = ({
  yearlyData,
  monthlyData
}) => {
  const [view, setView] = useState<'year' | 'month'>('year');
  const [metric, setMetric] = useState<'plays' | 'hours'>('plays');

  const data = view === 'year' ? yearlyData : monthlyData.slice(-36); // last 36 months if monthly

  return (
    <div className="w-full flex flex-col h-72">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMetric('plays')}
            className={cn(
              'px-2 py-1 rounded-md font-medium cursor-pointer transition-colors',
              metric === 'plays'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            )}
          >
            Streams
          </button>
          <button
            type="button"
            onClick={() => setMetric('hours')}
            className={cn(
              'px-2 py-1 rounded-md font-medium cursor-pointer transition-colors',
              metric === 'hours'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            )}
          >
            Hours
          </button>
        </div>

        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setView('year')}
            className={cn(
              'px-2 py-1 rounded-md font-medium cursor-pointer transition-colors',
              view === 'year'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            )}
          >
            Yearly
          </button>
          <button
            type="button"
            onClick={() => setView('month')}
            className={cn(
              'px-2 py-1 rounded-md font-medium cursor-pointer transition-colors',
              view === 'month'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            )}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="spotifyColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => metric === 'plays' ? (v >= 1000 ? `${(v/1000).toFixed(0)}k` : v) : `${v}h`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white">{label}</div>
                      <div className="mt-1 text-slate-600 dark:text-slate-300">
                        {metric === 'plays' ? (
                          <span>Streams: <span className="font-mono font-medium">{formatNumber(val)}</span></span>
                        ) : (
                          <span>Listening: <span className="font-mono font-medium">{val} hrs</span></span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#spotifyColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
