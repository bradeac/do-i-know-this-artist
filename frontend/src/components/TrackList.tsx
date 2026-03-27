import { motion } from 'motion/react'
import type { Track } from '../services/types'
import TrackCard from './TrackCard'

interface TrackListProps {
  tracks: Track[]
}

export default function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-text-muted text-lg font-light">No results found.</p>
        <p className="text-text-muted text-sm mt-1">Try a different search or check your playlist settings.</p>
      </motion.div>
    )
  }

  const grouped = tracks.reduce<Record<string, Track[]>>((acc, track) => {
    const key = track.playlistName || 'Unknown Playlist'
    if (!acc[key]) acc[key] = []
    acc[key].push(track)
    return acc
  }, {})

  let globalIndex = 0

  return (
    <div className="w-full max-w-2xl space-y-8">
      {Object.entries(grouped).map(([playlistName, playlistTracks], groupIdx) => (
        <motion.div
          key={playlistName}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: groupIdx * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3 px-3">
            <h3 className="font-display text-xl tracking-wide text-amber-warm uppercase">{playlistName}</h3>
            <span className="text-text-muted text-xs font-body">{playlistTracks.length} {playlistTracks.length === 1 ? 'track' : 'tracks'}</span>
            <div className="flex-1 h-px bg-border-warm" />
          </div>
          <div>
            {playlistTracks.map((track) => {
              const idx = globalIndex++
              return <TrackCard key={track.id} track={track} index={idx} />
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
