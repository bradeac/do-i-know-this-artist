import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SettingsModal from '../SettingsModal'
import type { Playlist } from '../../services/types'

const mockPlaylists: Playlist[] = [
  { id: 'PL1', title: 'Favorites', thumbnail: '', trackCount: 10 },
  { id: 'PL2', title: 'Watch Later', thumbnail: '', trackCount: 5 },
  { id: 'PL3', title: 'Rock', thumbnail: '', trackCount: 20 },
]

describe('SettingsModal', () => {
  it('renders all playlists with checkboxes', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={() => {}}
        playlists={mockPlaylists}
        selectedIds={['PL1', 'PL3']}
        onSelectionChange={() => {}}
      />
    )
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Watch Later')).toBeInTheDocument()
    expect(screen.getByText('Rock')).toBeInTheDocument()
  })

  it('checks boxes for selected playlists', () => {
    render(
      <SettingsModal
        isOpen={true}
        onClose={() => {}}
        playlists={mockPlaylists}
        selectedIds={['PL1', 'PL3']}
        onSelectionChange={() => {}}
      />
    )
    // Sorted: Favorites, Rock, Watch Later
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
    expect(checkboxes[0].checked).toBe(true)  // Favorites
    expect(checkboxes[1].checked).toBe(true)  // Rock
    expect(checkboxes[2].checked).toBe(false) // Watch Later
  })

  it('calls onSelectionChange when toggling a playlist', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SettingsModal
        isOpen={true}
        onClose={() => {}}
        playlists={mockPlaylists}
        selectedIds={['PL1', 'PL3']}
        onSelectionChange={onChange}
      />
    )
    // Sorted: Favorites, Rock, Watch Later — index 2 is Watch Later
    await user.click(screen.getAllByRole('checkbox')[2]) // toggle Watch Later on
    expect(onChange).toHaveBeenCalledWith(['PL1', 'PL3', 'PL2'])
  })

  it('calls onSelectionChange when unchecking a playlist', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SettingsModal
        isOpen={true}
        onClose={() => {}}
        playlists={mockPlaylists}
        selectedIds={['PL1', 'PL3']}
        onSelectionChange={onChange}
      />
    )
    await user.click(screen.getAllByRole('checkbox')[0]) // toggle Favorites off
    expect(onChange).toHaveBeenCalledWith(['PL3'])
  })

  it('does not render when isOpen is false', () => {
    render(
      <SettingsModal
        isOpen={false}
        onClose={() => {}}
        playlists={mockPlaylists}
        selectedIds={[]}
        onSelectionChange={() => {}}
      />
    )
    expect(screen.queryByText('Favorites')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        playlists={mockPlaylists}
        selectedIds={[]}
        onSelectionChange={() => {}}
      />
    )
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('has select all and deselect all buttons', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <SettingsModal
        isOpen={true}
        onClose={() => {}}
        playlists={mockPlaylists}
        selectedIds={['PL1']}
        onSelectionChange={onChange}
      />
    )
    await user.click(screen.getByRole('button', { name: /^select all$/i }))
    expect(onChange).toHaveBeenCalledWith(['PL1', 'PL2', 'PL3'])

    onChange.mockClear()
    await user.click(screen.getByRole('button', { name: /^deselect all$/i }))
    expect(onChange).toHaveBeenCalledWith([])
  })
})
