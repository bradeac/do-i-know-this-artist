export interface GoogleUser {
  name: string
  email: string
  picture: string
}

interface TokenClient {
  requestAccessToken: () => void
}

let tokenClient: TokenClient | null = null

export function initGoogleAuth(clientId: string, onSuccess: (accessToken: string, user: GoogleUser, expiresIn: number) => void): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      const google = (window as any).google

      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/youtube.readonly openid profile email',
        callback: async (response: any) => {
          if (response.access_token) {
            // Fetch user info
            const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` },
            })
            const userInfo = await userRes.json()
            onSuccess(response.access_token, {
              name: userInfo.name || '',
              email: userInfo.email || '',
              picture: userInfo.picture || '',
            }, response.expires_in || 3600)
          }
        },
      })
      resolve()
    }
    document.head.appendChild(script)
  })
}

export function requestAccessToken() {
  tokenClient?.requestAccessToken()
}
