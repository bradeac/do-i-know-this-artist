import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App'
import PrivacyPage from './components/PrivacyPage'
import TermsPage from './components/TermsPage'
import { AuthProvider } from './context/AuthContext'

const path = window.location.pathname

function Root() {
  if (path === '/privacy') return <PrivacyPage />
  if (path === '/terms') return <TermsPage />
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
