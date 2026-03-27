export interface Track {
  id: string
  title: string
  artist: string
  thumbnail: string
  url: string
  playlistName: string
}

export interface Playlist {
  id: string
  title: string
  thumbnail: string
  trackCount: number
}

export interface MusicProvider {
  name: string
  getPlaylists(accessToken: string): Promise<Playlist[]>
  getTracks(playlistId: string, accessToken: string): Promise<Track[]>
}
