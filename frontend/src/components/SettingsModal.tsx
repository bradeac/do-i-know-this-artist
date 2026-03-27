import type { Playlist } from '../services/types'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  playlists: Playlist[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export default function SettingsModal({ isOpen, onClose, playlists, selectedIds, onSelectionChange }: SettingsModalProps) {
  if (!isOpen) return null

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-3">Search in these playlists:</p>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => onSelectionChange(playlists.map((p) => p.id))}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Select all
          </button>
          <span className="text-gray-600">|</span>
          <button
            onClick={() => onSelectionChange([])}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Deselect all
          </button>
        </div>

        <div className="overflow-y-auto flex-1 space-y-2">
          {[...playlists].sort((a, b) => a.title.localeCompare(b.title)).map((playlist) => (
            <label
              key={playlist.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(playlist.id)}
                onChange={() => toggle(playlist.id)}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-white truncate">{playlist.title}</span>
              <span className="text-gray-500 text-sm ml-auto">{playlist.trackCount} tracks</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
