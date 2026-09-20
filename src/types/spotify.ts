export interface SpotifyStream {
  id: string;
  ts: string;
  track: string;
  artist: string;
  album: string;
  duration_sec: number;
  platform: string;
  shuffle: boolean;
  skipped: boolean;
  reason_start: string;
  reason_end: string;
}

export interface SpotifyArtist {
  artist: string;
  plays: number;
  hours: number;
  unique_tracks: number;
  skip_rate: number;
}

export interface SpotifyTrack {
  track: string;
  artist: string;
  album: string;
  plays: number;
  hours: number;
  minutes: number;
  skip_rate: number;
}

export interface SpotifyPlatform {
  platform: string;
  count: number;
  percentage: number;
}

export interface SpotifyReason {
  reason: string;
  count: number;
}

export interface SpotifyTimelinePoint {
  period: string;
  plays: number;
  hours: number;
}

export interface SpotifyKPIs {
  total_plays: number;
  total_hours: number;
  unique_artists: number;
  unique_tracks: number;
  skip_count: number;
  skip_rate: number;
  shuffle_on_count: number;
  shuffle_off_count: number;
  shuffle_rate: number;
}

export interface SpotifySummaryData {
  kpis: SpotifyKPIs;
  top_artists: SpotifyArtist[];
  top_tracks: SpotifyTrack[];
  platforms: SpotifyPlatform[];
  reasons_start: SpotifyReason[];
  reasons_end: SpotifyReason[];
  timeline_yearly: SpotifyTimelinePoint[];
  timeline_monthly: SpotifyTimelinePoint[];
  sample_streams: SpotifyStream[];
}
