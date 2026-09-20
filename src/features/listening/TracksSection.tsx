import React, { useState, useMemo } from 'react';
import { Music, Search, Play, Clock, SkipForward } from 'lucide-react';
import { useDataStore } from '../../store/useDataStore';
import { useUIStore } from '../../store/useUIStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatNumber, formatPercent } from '../../lib/formatters';

export const TracksSection: React.FC = () => {
  const { spotifySummary } = useDataStore();
  const { setSelectedArtist } = useUIStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const tracks = spotifySummary?.top_tracks || [];

  const filteredTracks = useMemo(() => {
    if (!search.trim()) return tracks;
    const q = search.toLowerCase().trim();
    return tracks.filter(
      (t) =>
        t.track.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  }, [tracks, search]);

  const totalPages = Math.ceil(filteredTracks.length / pageSize);
  const paginatedTracks = filteredTracks.slice((page - 1) * pageSize, page * pageSize);

  const handleArtistClick = (artistName: string) => {
    const found = spotifySummary?.top_artists.find(
      (a) => a.artist.toLowerCase() === artistName.toLowerCase()
    );
    if (found) {
      setSelectedArtist(found);
    }
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle>Top Tracks Analysis</CardTitle>
          <CardDescription>
            Showing {filteredTracks.length} tracks ranked by play count and listening duration
          </CardDescription>
        </div>
        <div className="w-full sm:w-72">
          <Input
            icon
            placeholder="Search tracks, artists, albums..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            onClear={() => {
              setSearch('');
              setPage(1);
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredTracks.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No tracks matched"
              description="No tracks match your query. Try searching by artist or album name."
              onAction={() => setSearch('')}
              actionText="Reset search"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">#</th>
                  <th className="px-4 py-3">Track Title</th>
                  <th className="px-4 py-3">Artist</th>
                  <th className="px-4 py-3">Album</th>
                  <th className="px-4 py-3 text-right">Plays</th>
                  <th className="px-4 py-3 text-right">Listening Time</th>
                  <th className="px-4 py-3 text-center">Skip Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {paginatedTracks.map((tr, index) => {
                  const rank = (page - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={`${tr.track}-${tr.artist}`}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-center font-mono text-slate-400 font-bold">
                        {String(rank).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {tr.track}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleArtistClick(tr.artist)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                        >
                          {tr.artist}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {tr.album}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatNumber(tr.plays)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {tr.minutes} mins
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={tr.skip_rate < 8 ? 'safe' : tr.skip_rate > 20 ? 'fraud' : 'unknown'}
                          className="text-[10px]"
                        >
                          {formatPercent(tr.skip_rate)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredTracks.length)} of {filteredTracks.length} tracks
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
