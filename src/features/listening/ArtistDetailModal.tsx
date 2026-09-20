import React, { useEffect } from 'react';
import { X, User, Music, Clock, Play, SkipForward } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useDataStore } from '../../store/useDataStore';
import { Badge } from '../../components/ui/Badge';
import { formatNumber, formatPercent } from '../../lib/formatters';

export const ArtistDetailModal: React.FC = () => {
  const { selectedArtist, setSelectedArtist } = useUIStore();
  const { spotifySummary } = useDataStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedArtist) {
        setSelectedArtist(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtist, setSelectedArtist]);

  if (!selectedArtist) return null;

  const artist = selectedArtist;

  // Find tracks belonging to this artist from top_tracks
  const artistTracks = spotifySummary?.top_tracks.filter(
    (t) => t.artist.toLowerCase() === artist.artist.toLowerCase()
  ) || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setSelectedArtist(null)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900/90 to-slate-900 text-white relative">
          <button
            type="button"
            onClick={() => setSelectedArtist(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close artist profile"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/30 border border-white/20 flex items-center justify-center text-white text-2xl font-bold">
              <User className="h-8 w-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                Artist Profile
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white">{artist.artist}</h2>
              <p className="text-xs text-indigo-200/80 mt-0.5">
                {artist.unique_tracks} unique catalog tracks in listening log
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-center">
          <div className="p-2">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Plays</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {formatNumber(artist.plays)}
            </div>
          </div>
          <div className="p-2">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Hours</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {artist.hours}h
            </div>
          </div>
          <div className="p-2">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Tracks</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {artist.unique_tracks}
            </div>
          </div>
          <div className="p-2">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Skip Rate</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              {formatPercent(artist.skip_rate)}
            </div>
          </div>
        </div>

        {/* Top Tracks for this artist */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Music className="h-4 w-4 text-indigo-600" />
              Most Played Tracks
            </h4>
            <span className="text-xs text-slate-400">{artistTracks.length} catalog hits</span>
          </div>

          {artistTracks.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              Plays distributed widely across full discography of {artist.unique_tracks} tracks.
            </div>
          ) : (
            <div className="space-y-2">
              {artistTracks.map((tr, i) => (
                <div
                  key={tr.track}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {tr.track}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{tr.album}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {tr.plays} plays
                      </div>
                      <div className="text-[10px] text-slate-400">{tr.minutes} mins</div>
                    </div>
                    <Badge variant={tr.skip_rate < 10 ? 'safe' : 'unknown'} className="text-[10px]">
                      {formatPercent(tr.skip_rate)} skip
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-center text-xs text-slate-400">
          Source: Spotify Listening Log Dataset (2013-2024) • Press ESC to close
        </div>
      </div>
    </div>
  );
};
