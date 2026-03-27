import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
}))

vi.mock('../../services/youtube', () => ({
  youtubeProvider: {
    name: 'YouTube',
    getPlaylists: vi.fn().mockResolvedValue([
      { id: 'PL1', title: 'Favorites', thumbnail: '', trackCount: 5 },
    ]),
    getTracks: vi.fn().mockResolvedValue([]),
  },
}))

import { useAuth } from '../../context/AuthContext'
const mockUseAuth = vi.mocked(useAuth)

describe('App', () => {
  it('shows loading state while auth initializes', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      accessToken: null,
      user: null,
      signIn: vi.fn(),
      isLoading: true,
    })
    const { container } = render(<App />)
    // Loading state shows vinyl spinner SVG
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows sign-in button when not signed in', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
      accessToken: null,
      user: null,
      signIn: vi.fn(),
      isLoading: false,
    })
    render(<App />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows search bar when signed in and playlists loaded', async () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      accessToken: 'token123',
      user: { name: 'John', email: 'john@test.com', picture: '' },
      signIn: vi.fn(),
      isLoading: false,
    })
    render(<App />)
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })
  })

  it('shows user name when signed in', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      accessToken: 'token123',
      user: { name: 'John', email: 'john@test.com', picture: '' },
      signIn: vi.fn(),
      isLoading: false,
    })
    render(<App />)
    expect(screen.getByText(/john/i)).toBeInTheDocument()
  })

  it('shows settings button when signed in', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      accessToken: 'token123',
      user: { name: 'John', email: 'john@test.com', picture: '' },
      signIn: vi.fn(),
      isLoading: false,
    })
    render(<App />)
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })
})
