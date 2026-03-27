import { motion, AnimatePresence } from 'motion/react'
import type { Playlist } from '../services/types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  playlists: Playlist[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export default function SettingsModal({ isOpen, onClose, playlists, selectedIds, onSelectionChange }: SettingsModalProps) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-surface-modal border border-border-warm rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl tracking-wide text-text-primary uppercase">Playlists</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-text-muted hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-text-secondary text-sm mb-3">Choose which playlists to search in:</p>

              <div className="flex gap-3">
                <button
                  onClick={() => onSelectionChange(playlists.map((p) => p.id))}
                  className="text-xs text-amber-warm hover:text-amber-glow transition-colors uppercase tracking-wider font-medium"
                >
                  Select all
                </button>
                <span className="text-border-warm">|</span>
                <button
                  onClick={() => onSelectionChange([])}
                  className="text-xs text-amber-warm hover:text-amber-glow transition-colors uppercase tracking-wider font-medium"
                >
                  Deselect all
                </button>
              </div>
            </div>

            {/* Playlist list */}
            <div className="overflow-y-auto flex-1 px-4 pb-4">
              {[...playlists].sort((a, b) => a.title.localeCompare(b.title)).map((playlist) => (
                <label
                  key={playlist.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors duration-150"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(playlist.id)}
                    onChange={() => toggle(playlist.id)}
                  />
                  <span className="text-text-primary text-sm truncate flex-1">{playlist.title}</span>
                  <span className="text-text-muted text-xs tabular-nums w-8 text-right shrink-0">{playlist.trackCount}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
