import App from './components/App'
import PrivacyPage from './components/PrivacyPage'
import TermsPage from './components/TermsPage'
import { AuthProvider } from './context/AuthProvider'

const path = window.location.pathname

export default function Root() {
  if (path === '/privacy') return <PrivacyPage />
  if (path === '/terms') return <TermsPage />
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
