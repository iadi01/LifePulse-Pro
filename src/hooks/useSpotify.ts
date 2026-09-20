import { useDataStore } from '../store/useDataStore';
import { getTopArtists, getListeningTime, getSkipRate, getTopTracks } from '../utils/spotifyAnalytics';

export function useSpotify() {
  const { spotifySummary, loading } = useDataStore();

  return {
    summary: spotifySummary,
    loading: loading.spotify,
    topArtists: getTopArtists(spotifySummary),
    topTracks: getTopTracks(spotifySummary),
    listeningTime: getListeningTime(spotifySummary),
    skipRate: getSkipRate(spotifySummary)
  };
}
