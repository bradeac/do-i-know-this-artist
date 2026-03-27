import type { Track } from '../services/types'
import TrackCard from './TrackCard'

interface TrackListProps {
  tracks: Track[]
}

export default function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return <p className="text-gray-400 text-center">No results found.</p>
  }

  const grouped = tracks.reduce<Record<string, Track[]>>((acc, track) => {
    const key = track.playlistName || 'Unknown Playlist'
    if (!acc[key]) acc[key] = []
    acc[key].push(track)
    return acc
  }, {})

  return (
    <div className="w-full max-w-xl space-y-6">
      {Object.entries(grouped).map(([playlistName, playlistTracks]) => (
        <div key={playlistName}>
          <h3 className="text-lg font-semibold text-white mb-3">{playlistName}</h3>
          <div className="space-y-2">
            {playlistTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
