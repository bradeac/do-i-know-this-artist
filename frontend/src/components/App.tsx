import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { youtubeProvider } from '../services/youtube'
import type { Track, Playlist } from '../services/types'
import SearchBar from './SearchBar'
import TrackList from './TrackList'
import SettingsModal from './SettingsModal'

const SELECTED_PLAYLISTS_KEY = 'dikta_selected_playlists'

function loadSelectedIds(): string[] | null {
  try {
    const raw = localStorage.getItem(SELECTED_PLAYLISTS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSelectedIds(ids: string[]) {
  localStorage.setItem(SELECTED_PLAYLISTS_KEY, JSON.stringify(ids))
}

export default function App() {
  const { isSignedIn, accessToken, user, signIn, isLoading: authLoading } = useAuth()
  const [tracks, setTracks] = useState<Track[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [playlistsLoading, setPlaylistsLoading] = useState(false)

  useEffect(() => {
    if (!isSignedIn || !accessToken) return

    setPlaylistsLoading(true)
    youtubeProvider.getPlaylists(accessToken).then((fetched) => {
      setPlaylists(fetched)
      const saved = loadSelectedIds()
      if (saved) {
        // Only keep IDs that still exist
        setSelectedPlaylistIds(saved.filter((id) => fetched.some((p) => p.id === id)))
      } else {
        // Default: all selected
        setSelectedPlaylistIds(fetched.map((p) => p.id))
      }
    }).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to load playlists')
    }).finally(() => {
      setPlaylistsLoading(false)
    })
  }, [isSignedIn, accessToken])

  const handleSelectionChange = (ids: string[]) => {
    setSelectedPlaylistIds(ids)
    saveSelectedIds(ids)
  }

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
      const allTracks: Track[] = []
      const toSearch = playlists.filter((p) => selectedPlaylistIds.includes(p.id))

      for (const playlist of toSearch) {
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-12 pb-24">
      <div className="w-full max-w-xl flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Do I Know This Artist?</h1>
        {isSignedIn && (
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        )}
      </div>

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

          {playlistsLoading ? (
            <p className="text-gray-400">Loading playlists...</p>
          ) : (
            <>
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
        </>
      )}

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        playlists={playlists}
        selectedIds={selectedPlaylistIds}
        onSelectionChange={handleSelectionChange}
      />

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 py-3 text-center text-sm text-gray-500">
        <a href="https://bradeac.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">bradeac.dev</a>
        <span className="mx-2">·</span>
        <span>Check out also <a href="https://music.bradeac.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">music.bradeac.dev</a></span>
      </footer>
    </div>
  )
}
