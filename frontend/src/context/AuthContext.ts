import { createContext, useContext } from 'react'
import type { GoogleUser } from '../auth/google'

export interface AuthState {
  isSignedIn: boolean
  accessToken: string | null
  user: GoogleUser | null
  signIn: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthState>({
  isSignedIn: false,
  accessToken: null,
  user: null,
  signIn: () => {},
  isLoading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}
