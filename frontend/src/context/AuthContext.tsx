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

const AuthContext = createContext<AuthState>({
  isSignedIn: false,
  accessToken: null,
  user: null,
  signIn: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID not set')
      setIsLoading(false)
      return
    }

    initGoogleAuth(clientId, (token, userInfo) => {
      setAccessToken(token)
      setUser(userInfo)
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
