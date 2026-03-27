import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { initGoogleAuth, requestAccessToken } from '../auth/google'
import type { GoogleUser } from '../auth/google'

interface AuthState {
  isSignedIn: boolean
  accessToken: string | null
  user: GoogleUser | null
  signIn: () => void
  isLoading: boolean
}

const AUTH_STORAGE_KEY = 'dikta_auth'

function loadAuth(): { accessToken: string; user: GoogleUser; expiresAt: number } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

function saveAuth(accessToken: string, user: GoogleUser, expiresInSeconds: number) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    accessToken,
    user,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  }))
}

const AuthContext = createContext<AuthState>({
  isSignedIn: false,
  accessToken: null,
  user: null,
  signIn: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const cached = loadAuth()
  const [accessToken, setAccessToken] = useState<string | null>(cached?.accessToken ?? null)
  const [user, setUser] = useState<GoogleUser | null>(cached?.user ?? null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID not set')
      setIsLoading(false)
      return
    }

    initGoogleAuth(clientId, (token, userInfo, expiresIn) => {
      setAccessToken(token)
      setUser(userInfo)
      saveAuth(token, userInfo, expiresIn)
    }).then(() => setIsLoading(false))
  }, [])

  const signIn = useCallback(() => {
    requestAccessToken()
  }, [])

  return (
    <AuthContext.Provider value={{
      isSignedIn: !!accessToken,
      accessToken,
      user,
      signIn,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
