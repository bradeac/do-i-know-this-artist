import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TrackCard from '../TrackCard'
import { Track } from '../../services/types'

const mockTrack: Track = {
  id: 'abc123',
  title: 'Karma Police',
  artist: 'Radiohead',
  thumbnail: 'http://img.youtube.com/thumb.jpg',
  url: 'https://www.youtube.com/watch?v=abc123',
  playlistName: 'Favorites',
}

describe('TrackCard', () => {
  it('renders track title', () => {
    render(<TrackCard track={mockTrack} />)
    expect(screen.getByText('Karma Police')).toBeInTheDocument()
  })

  it('renders artist name', () => {
    render(<TrackCard track={mockTrack} />)
    expect(screen.getByText('Radiohead')).toBeInTheDocument()
  })

  it('renders thumbnail image', () => {
    render(<TrackCard track={mockTrack} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockTrack.thumbnail)
  })

  it('renders a link to the YouTube video', () => {
    render(<TrackCard track={mockTrack} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', mockTrack.url)
    expect(link).toHaveAttribute('target', '_blank')
  })
})
