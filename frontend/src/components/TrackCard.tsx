import type { Track } from '../services/types'

interface TrackCardProps {
  track: Track
}

export default function TrackCard({ track }: TrackCardProps) {
  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
    >
      <img
        src={track.thumbnail}
        alt={track.title}
        className="w-12 h-12 rounded object-cover"
      />
      <div className="min-w-0">
        <p className="text-white font-medium truncate">{track.title}</p>
        <p className="text-gray-400 text-sm truncate">{track.artist}</p>
      </div>
    </a>
  )
}
