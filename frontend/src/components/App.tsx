import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { youtubeProvider } from '../services/youtube'
import type { Track, Playlist } from '../services/types'
import SearchBar from './SearchBar'
import TrackList from './TrackList'

export default function App() {
  const { isSignedIn, accessToken, user, signIn, isLoading: authLoading } = useAuth()
  const [tracks, setTracks] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  const handleSearch = async (query: string) => {
    if (!accessToken) return
    setIsSearching(true)
    setError(null)
    setTracks([])
    setHasSearched(true)

    try {
      const playlists: Playlist[] = await youtubeProvider.getPlaylists(accessToken)
      const allTracks: Track[] = []

      for (const playlist of playlists) {
        const playlistTracks = await youtubeProvider.getTracks(playlist.id, accessToken)
        const matched = playlistTracks
          .filter((t) => {
            const q = query.toLowerCase()
            return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
          })
          .map((t) => ({ ...t, playlistName: playlist.title }))
        allTracks.push(...matched)
      }

      setTracks(allTracks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Do I Know This Artist?</h1>

      {!isSignedIn ? (
        <div className="mt-8">
          <p className="text-gray-400 mb-4 text-center">
            Search your YouTube playlists by artist or track name.
          </p>
          <button
            onClick={signIn}
            className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-400 mb-6">
            Signed in as <span className="text-white">{user?.name}</span>
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />

          {isSearching && (
            <p className="mt-6 text-gray-400">Searching your playlists...</p>
          )}

          {error && (
            <p className="mt-6 text-red-400">{error}</p>
          )}

          {hasSearched && !isSearching && !error && (
            <div className="mt-6 w-full flex justify-center">
              <TrackList tracks={tracks} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
