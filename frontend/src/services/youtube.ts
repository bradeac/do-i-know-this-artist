import type { MusicProvider, Playlist, Track } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const youtubeProvider: MusicProvider = {
  name: 'YouTube',

  async getPlaylists(accessToken: string): Promise<Playlist[]> {
    const res = await fetch(`${API_BASE}/api/youtube/playlists?accessToken=${accessToken}`)
    if (!res.ok) throw new Error(`Failed to fetch playlists: ${res.status}`)
    const data = await res.json()
    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.default?.url || '',
      trackCount: item.contentDetails?.itemCount || 0,
    }))
  },

  async getTracks(playlistId: string, accessToken: string): Promise<Track[]> {
    const res = await fetch(`${API_BASE}/api/youtube/tracks?playlistId=${playlistId}&accessToken=${accessToken}`)
    if (!res.ok) throw new Error(`Failed to fetch tracks: ${res.status}`)
    const data = await res.json()
    return (data.items || []).map((item: any) => ({
      id: item.snippet?.resourceId?.videoId || item.id,
      title: item.snippet?.title || '',
      artist: item.snippet?.videoOwnerChannelTitle || '',
      thumbnail: item.snippet?.thumbnails?.default?.url || '',
      url: `https://music.youtube.com/watch?v=${item.snippet?.resourceId?.videoId || item.id}`,
      playlistName: '',
    }))
  },
}
