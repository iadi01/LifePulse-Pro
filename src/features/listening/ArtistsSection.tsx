import React, { useState, useMemo } from 'react';
import { User, Search, Play, Clock, Music, ArrowRight } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';
import { SpotifyArtist } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatNumber, formatPercent } from '../../lib/formatters';

export const ArtistsSection: React.FC = () => {
  const { spotifySummary } = useDataStore();
  const { setSelectedArtist } = useUIStore();
  const [search, setSearch] = useState('');

  const artists = spotifySummary?.top_artists || [];

  const filteredArtists = useMemo(() => {
    if (!search.trim()) return artists;
    return artists.filter((a) =>
      a.artist.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [artists, search]);

  return (
    <Card className="border-slate-200/80 dark:border-slate-800">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle>Top Artists Catalog</CardTitle>
          <CardDescription>
            Ranked by playback frequency across 4,113 unique artists in listening history
          </CardDescription>
        </div>
        <div className="w-full sm:w-64">
          <Input
            icon
            placeholder="Search artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredArtists.map((artist, idx) => (
            <div
              key={artist.artist}
              onClick={() => setSelectedArtist(artist)}
              className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                    #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <Badge variant={artist.skip_rate < 8 ? 'safe' : 'default'} className="text-[10px]">
                    {formatPercent(artist.skip_rate)} skip
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {artist.artist}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {artist.unique_tracks} catalog tracks
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {formatNumber(artist.plays)} plays
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{artist.hours}h</span>
                </div>
                <span className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[11px] font-semibold">
                  View <ArrowRight className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
