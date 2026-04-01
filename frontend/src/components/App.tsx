import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function VinylIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="50" cy="50" r="4" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export default function App() {
  const { isSignedIn, accessToken, user, signIn, isLoading: authLoading } = useAuth()
  const [tracks, setTracks] = useState<Track[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState('')
  const [isReady, setIsReady] = useState(false)

  // Cache: all tracks per playlist, keyed by playlist id
  const trackCache = useRef<Map<string, Track[]>>(new Map())

  // Fetch playlists + all tracks on sign-in
  useEffect(() => {
    if (!isSignedIn || !accessToken) return

    let cancelled = false

    async function loadEverything() {
      try {
        setLoadingProgress('Loading playlists...')
        const fetched = await youtubeProvider.getPlaylists(accessToken!)
        if (cancelled) return

        setPlaylists(fetched)
        const saved = loadSelectedIds()
        const selectedIds = saved
          ? saved.filter((id) => fetched.some((p) => p.id === id))
          : fetched.map((p) => p.id)
        setSelectedPlaylistIds(selectedIds)

        // Fetch tracks for all playlists with delay to avoid rate limiting
        for (let i = 0; i < fetched.length; i++) {
          if (cancelled) return
          const playlist = fetched[i]
          setLoadingProgress(`Loading tracks: ${playlist.title} (${i + 1}/${fetched.length})`)

          try {
            const playlistTracks = await youtubeProvider.getTracks(playlist.id, accessToken!)
            trackCache.current.set(playlist.id, playlistTracks.map((t) => ({ ...t, playlistName: playlist.title })))
          } catch {
            // Skip playlists that fail, don't break the whole load
            trackCache.current.set(playlist.id, [])
          }

          // Small delay between requests to avoid rate limiting
          if (i < fetched.length - 1) {
            await delay(200)
          }
        }

        if (!cancelled) {
          setIsReady(true)
          setLoadingProgress('')
          // Show settings on first login so user can pick playlists
          if (!saved) {
            setSettingsOpen(true)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data')
          setLoadingProgress('')
        }
      }
    }

    loadEverything()
    return () => { cancelled = true }
  }, [isSignedIn, accessToken])

  const handleSelectionChange = (ids: string[]) => {
    setSelectedPlaylistIds(ids)
    saveSelectedIds(ids)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <VinylIcon className="w-16 h-16 text-amber-warm vinyl-spin" />
      </div>
    )
  }

  const handleSearch = (query: string) => {
    setHasSearched(true)
    setError(null)

    const q = query.toLowerCase()
    const results: Track[] = []

    for (const playlistId of selectedPlaylistIds) {
      const cached = trackCache.current.get(playlistId)
      if (!cached) continue
      const matched = cached.filter(
        (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
      )
      results.push(...matched)
    }

    setTracks(results)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border-subtle">
        <div className="max-w-2xl mx-auto w-full px-8 py-5 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl tracking-wider text-text-primary uppercase"
          >
            Do I Know This Artist?
          </motion.h1>

          {isSignedIn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <span className="text-text-muted text-xs hidden sm:inline">{user?.name}</span>
              <button
                onClick={() => setSettingsOpen(true)}
                className="text-text-muted hover:text-amber-warm transition-colors p-2 rounded-lg hover:bg-surface-raised"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
              </button>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-8 py-10 pb-28">
        <AnimatePresence mode="wait">
          {!isSignedIn ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center pt-24"
            >
              <VinylIcon className="w-20 h-20 text-amber-dim mb-8" />
              <p className="text-text-secondary text-center max-w-sm mb-10 font-light leading-relaxed">
                Search across your YouTube playlists to find if you already know an artist or track.
              </p>
              <button
                onClick={signIn}
                className="px-8 py-3.5 bg-amber-warm text-black font-medium rounded-xl hover:bg-amber-glow transition-all duration-300 text-sm tracking-wide uppercase"
              >
                Sign in with Google
              </button>
            </motion.div>
          ) : !isReady ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center pt-24"
            >
              <VinylIcon className="w-14 h-14 text-amber-warm vinyl-spin mb-4" />
              <p className="text-text-secondary text-sm">{loadingProgress}</p>
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SearchBar onSearch={handleSearch} isLoading={false} />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-red-400/80 text-sm"
                >
                  {error}
                </motion.p>
              )}

              {hasSearched && (
                <div className="mt-8">
                  {tracks.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-text-muted text-xs mb-6 tracking-wide uppercase"
                    >
                      {tracks.length} {tracks.length === 1 ? 'result' : 'results'} found
                    </motion.p>
                  )}
                  <TrackList tracks={tracks} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-sm border-t border-border-subtle py-3 text-center text-xs text-text-muted">
        <a href="https://bradeac.dev" target="_blank" rel="noopener noreferrer" className="hover:text-amber-warm transition-colors duration-200">bradeac.dev</a>
        <span className="mx-2 text-border-warm">/</span>
        <span>Check out also <a href="https://music.bradeac.dev" target="_blank" rel="noopener noreferrer" className="hover:text-amber-warm transition-colors duration-200">music.bradeac.dev</a></span>
        <span className="mx-2 text-border-warm">/</span>
        <a href="/privacy" className="hover:text-amber-warm transition-colors duration-200">Privacy</a>
        <span className="mx-2 text-border-warm">/</span>
        <a href="/terms" className="hover:text-amber-warm transition-colors duration-200">Terms</a>
      </footer>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        playlists={playlists}
        selectedIds={selectedPlaylistIds}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  )
}
