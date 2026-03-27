import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TrackList from '../TrackList'
import { Track } from '../../services/types'

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Karma Police',
    artist: 'Radiohead',
    thumbnail: 'http://img1.jpg',
    url: 'https://youtube.com/watch?v=1',
    playlistName: 'Favorites',
  },
  {
    id: '2',
    title: 'No Surprises',
    artist: 'Radiohead',
    thumbnail: 'http://img2.jpg',
    url: 'https://youtube.com/watch?v=2',
    playlistName: 'Favorites',
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    thumbnail: 'http://img3.jpg',
    url: 'https://youtube.com/watch?v=3',
    playlistName: 'Rock Classics',
  },
]

describe('TrackList', () => {
  it('renders tracks grouped by playlist name', () => {
    render(<TrackList tracks={mockTracks} />)
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.getByText('Rock Classics')).toBeInTheDocument()
  })

  it('renders all track titles', () => {
    render(<TrackList tracks={mockTracks} />)
    expect(screen.getByText('Karma Police')).toBeInTheDocument()
    expect(screen.getByText('No Surprises')).toBeInTheDocument()
    expect(screen.getByText('Bohemian Rhapsody')).toBeInTheDocument()
  })

  it('shows empty message when no tracks', () => {
    render(<TrackList tracks={[]} />)
    expect(screen.getByText(/no results/i)).toBeInTheDocument()
  })
})
