import { motion } from 'motion/react'
import type { Track } from '../services/types'

interface TrackCardProps {
  track: Track
  index: number
}

export default function TrackCard({ track, index }: TrackCardProps) {
  return (
    <motion.a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-surface-hover transition-colors duration-200 cursor-pointer"
    >
      <div className="relative shrink-0">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-11 h-11 rounded object-cover brightness-90 group-hover:brightness-110 transition-all duration-200"
        />
        <div className="absolute inset-0 rounded ring-1 ring-white/5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-text-primary font-medium text-sm truncate group-hover:text-amber-warm transition-colors duration-200">
          {track.title}
        </p>
        <p className="text-text-secondary text-xs truncate mt-0.5">{track.artist}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </motion.a>
  )
}
