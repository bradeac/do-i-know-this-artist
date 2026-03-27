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

const TOKEN_KEY = 'dikta_token'
const USER_KEY = 'dikta_user'

function loadToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    return data.accessToken
  } catch {
    return null
  }
}

function loadUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveAuth(accessToken: string, user: GoogleUser, expiresInSeconds: number) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify({
    accessToken,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  }))
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const AuthContext = createContext<AuthState>({
  isSignedIn: false,
  accessToken: null,
  user: null,
  signIn: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(loadToken)
  const [user, setUser] = useState<GoogleUser | null>(loadUser)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID not set')
      setIsLoading(false)
      return
    }

    const previousUser = loadUser()

    initGoogleAuth(clientId, (token, userInfo, expiresIn) => {
      setAccessToken(token)
      setUser(userInfo)
      saveAuth(token, userInfo, expiresIn)
    }).then(() => {
      setIsLoading(false)
      // User was previously signed in but token expired — silently get a new one
      if (previousUser && !loadToken()) {
        requestAccessToken()
      }
    })
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
