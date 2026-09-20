import { SpotifyArtist, SpotifySummaryData, SpotifyTrack } from '../types/spotify';

export function getTopArtists(data: SpotifySummaryData | null, limit: number = 10): SpotifyArtist[] {
  if (!data || !data.top_artists) return [];
  return data.top_artists.slice(0, limit);
}

export function getListeningTime(data: SpotifySummaryData | null): number {
  if (!data || !data.kpis) return 0;
  return data.kpis.total_hours;
}

export function getSkipRate(data: SpotifySummaryData | null): number {
  if (!data || !data.kpis) return 0;
  return data.kpis.skip_rate;
}

export function calculateSkipRate(skipped: number, total: number): number {
  if (!total || total === 0) return 0;
  return Number(((skipped / total) * 100).toFixed(2));
}

export function getTopTracks(data: SpotifySummaryData | null, limit: number = 10): SpotifyTrack[] {
  if (!data || !data.top_tracks) return [];
  return data.top_tracks.slice(0, limit);
}
