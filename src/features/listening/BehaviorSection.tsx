import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Smartphone,
  Shuffle,
  SkipForward,
  PlayCircle,
  Laptop,
  Cast
} from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { formatNumber, formatPercent } from '../../lib/formatters';

export const BehaviorSection: React.FC = () => {
  const { spotifySummary } = useDataStore();

  if (!spotifySummary) return null;

  const { kpis, platforms, reasons_start, reasons_end } = spotifySummary;

  // Skip distribution data
  const skipData = [
    { name: 'Completed', value: kpis.total_plays - kpis.skip_count, color: '#10b981' },
    { name: 'Skipped', value: kpis.skip_count, color: '#f43f5e' }
  ];

  // Shuffle distribution data
  const shuffleData = [
    { name: 'Shuffle On', value: kpis.shuffle_on_count, color: '#6366f1' },
    { name: 'Sequential', value: kpis.shuffle_off_count, color: '#94a3b8' }
  ];

  return (
    <div className="space-y-6">
      {/* 2 Donut Charts: Skip vs Shuffle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skip Behavior */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SkipForward className="h-4 w-4 text-rose-500" />
              <CardTitle>Stream Completion vs Skip Rate</CardTitle>
            </div>
            <CardDescription>
              Evaluation of intentional skips vs fully completed tracks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skipData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {skipData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                            <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                              {p.name}
                            </div>
                            <div className="mt-1 text-slate-600 dark:text-slate-300 font-mono">
                              {formatNumber(p.value)} ({formatPercent((p.value / kpis.total_plays) * 100)})
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatPercent(kpis.skip_rate)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Skip Rate</span>
              </div>
            </div>

            <div className="flex justify-around pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {skipData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-500 dark:text-slate-400">{d.name}:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{formatNumber(d.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shuffle Behavior */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-indigo-500" />
              <CardTitle>Shuffle vs Sequential Playback</CardTitle>
            </div>
            <CardDescription>
              Randomized playback frequency vs album/playlist sequence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={shuffleData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {shuffleData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
                            <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                              {p.name}
                            </div>
                            <div className="mt-1 text-slate-600 dark:text-slate-300 font-mono">
                              {formatNumber(p.value)} ({formatPercent((p.value / kpis.total_plays) * 100)})
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatPercent(kpis.shuffle_rate)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">Shuffle Mode</span>
              </div>
            </div>

            <div className="flex justify-around pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {shuffleData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-500 dark:text-slate-400">{d.name}:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">{formatNumber(d.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-500" />
            <CardTitle>Streaming Platforms & Operating Systems</CardTitle>
          </div>
          <CardDescription>
            Streams grouped by registered client application in raw dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {platforms.map((p) => (
              <div
                key={p.platform}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-1"
              >
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                  {p.platform}
                </div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatNumber(p.count)}
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {p.percentage}% of all streams
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Playback Mechanics: Reason Start vs Reason End */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Playback Initiation (Reason Start)</CardTitle>
            <CardDescription>
              Triggers leading to track playback (trackdone, fwdbtn, clickrow, appload)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reasons_start} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="reason" stroke="#94a3b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={75} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2 rounded shadow text-xs">
                            <span className="font-semibold">{p.reason}: </span>
                            <span className="font-mono">{formatNumber(p.count)}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Playback Termination (Reason End)</CardTitle>
            <CardDescription>
              Causes for track stoppage (natural end, forward skip, logout, endplay)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reasons_end} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="reason" stroke="#94a3b8" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={75} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-2 rounded shadow text-xs">
                            <span className="font-semibold">{p.reason}: </span>
                            <span className="font-mono">{formatNumber(p.count)}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
