import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(),
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
    render(<App />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
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

  it('shows search bar when signed in', () => {
    mockUseAuth.mockReturnValue({
      isSignedIn: true,
      accessToken: 'token123',
      user: { name: 'John', email: 'john@test.com', picture: '' },
      signIn: vi.fn(),
      isLoading: false,
    })
    render(<App />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
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
})
