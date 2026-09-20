import React from 'react';
import {
  Headphones,
  Music,
  User,
  Clock,
  Shuffle,
  SkipForward,
  BarChart2
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { KpiCard } from '../../components/common/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { ListeningTimelineChart } from '../../components/charts/ListeningTimelineChart';
import { ArtistsSection } from './ArtistsSection';
import { TracksSection } from './TracksSection';
import { BehaviorSection } from './BehaviorSection';
import { KpiSkeleton } from '../../components/ui/Skeleton';
import { formatNumber, formatPercent, formatHours } from '../../lib/formatters';

export const ListeningPage: React.FC = () => {
  const { subSection, setSubSection } = useUIStore();
  const { spotifySummary, loading } = useDataStore();

  const activeTab =
    subSection === 'artists'
      ? 'artists'
      : subSection === 'tracks'
      ? 'tracks'
      : subSection === 'behavior'
      ? 'behavior'
      : 'overview';

  if (loading.spotify || !spotifySummary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const { kpis } = spotifySummary;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Audio Intelligence Lens
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Listening Intelligence
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Explore 11 years of verified Spotify streaming activity, artist affinities, and playback dynamics.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start">
          <button
            type="button"
            onClick={() => setSubSection('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Headphones className="h-3.5 w-3.5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => setSubSection('artists')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'artists'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Top Artists
          </button>
          <button
            type="button"
            onClick={() => setSubSection('tracks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'tracks'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Music className="h-3.5 w-3.5" />
            Top Tracks
          </button>
          <button
            type="button"
            onClick={() => setSubSection('behavior')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium cursor-pointer transition-colors ${
              activeTab === 'behavior'
                ? 'bg-white text-indigo-700 dark:bg-slate-900 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Behavior
          </button>
        </div>
      </div>

      {/* 6 Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard
          title="Total Streams"
          value={formatNumber(kpis.total_plays)}
          subtitle="2013 - 2024"
          icon={Headphones}
          accentColor="emerald"
        />
        <KpiCard
          title="Listening Time"
          value={formatHours(kpis.total_hours)}
          subtitle="Total duration"
          icon={Clock}
          accentColor="indigo"
        />
        <KpiCard
          title="Unique Artists"
          value={formatNumber(kpis.unique_artists)}
          subtitle="Artist catalog"
          icon={User}
          accentColor="slate"
        />
        <KpiCard
          title="Unique Tracks"
          value={formatNumber(kpis.unique_tracks)}
          subtitle="Unique recordings"
          icon={Music}
          accentColor="slate"
        />
        <KpiCard
          title="Skipped Tracks"
          value={formatNumber(kpis.skip_count)}
          subtitle={`${formatPercent(kpis.skip_rate)} skip rate`}
          icon={SkipForward}
          accentColor="rose"
        />
        <KpiCard
          title="Shuffle Rate"
          value={formatPercent(kpis.shuffle_rate)}
          subtitle={`${formatNumber(kpis.shuffle_on_count)} streams`}
          icon={Shuffle}
          accentColor="indigo"
        />
      </div>

      {/* Sub-view Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Listening Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Streaming History Timeline</CardTitle>
              <CardDescription>
                Historical playback volume and listening hours from 2013 to 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ListeningTimelineChart
                yearlyData={spotifySummary.timeline_yearly}
                monthlyData={spotifySummary.timeline_monthly}
              />
            </CardContent>
          </Card>

          {/* Quick Views: Top Artists Preview & Behavior Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Top 5 Artists</CardTitle>
                  <CardDescription>Ranked by total historical plays</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setSubSection('artists')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  View all 100 artists →
                </button>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                {spotifySummary.top_artists.slice(0, 5).map((a, i) => (
                  <div
                    key={a.artist}
                    onClick={() => useUIStore.getState().setSelectedArtist(a)}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 w-5">
                        0{i + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white">
                          {a.artist}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {a.unique_tracks} tracks in library
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {formatNumber(a.plays)} plays
                      </div>
                      <div className="text-[11px] text-slate-400">{a.hours} hrs</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Platform Distribution</CardTitle>
                  <CardDescription>Client platforms used over time</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setSubSection('behavior')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Full Behavior Lab →
                </button>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {spotifySummary.platforms.map((p) => (
                  <div key={p.platform} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-slate-700 dark:text-slate-300">
                        {p.platform}
                      </span>
                      <span className="font-mono text-slate-500">
                        {formatNumber(p.count)} ({p.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${p.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'artists' && <ArtistsSection />}

      {activeTab === 'tracks' && <TracksSection />}

      {activeTab === 'behavior' && <BehaviorSection />}
    </div>
  );
};
