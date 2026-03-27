export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-xl mx-auto px-6 py-16">
        <a href="/" className="text-text-muted text-sm hover:text-amber-warm transition-colors">&larr; Back to app</a>
        <h1 className="font-display text-3xl tracking-wider text-text-primary uppercase mt-8 mb-10">Privacy Policy</h1>

        <Section title="What we access">
          When you sign in with Google, we request read-only access to your YouTube playlists and basic profile info (name, email, profile picture). This is used solely to let you search your own playlists.
        </Section>

        <Section title="Data storage">
          Your Google access token and basic profile info are stored in your browser's localStorage. No personal data is sent to or stored on our servers. Your playlist selection preferences are stored locally in your browser.
        </Section>

        <Section title="Third-party services">
          We use the YouTube Data API to fetch your playlists and tracks. API requests are proxied through our backend server, which adds the API key but does not log or store any of your data. We use Google Identity Services for authentication.
        </Section>

        <Section title="Cookies">
          We do not use cookies. Authentication state is managed via localStorage.
        </Section>

        <Section title="Data sharing">
          We do not share, sell, or transfer your data to any third party.
        </Section>

        <Section title="Contact">
          Questions? Reach out at <a href="https://bradeac.dev" className="text-amber-warm hover:text-amber-glow transition-colors">bradeac.dev</a>.
        </Section>

        <p className="text-text-muted text-xs mt-12">Last updated: March 27, 2026</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-amber-warm text-sm font-medium uppercase tracking-wider mb-2">{title}</h2>
      <p className="text-text-secondary text-sm font-light leading-relaxed">{children}</p>
    </div>
  )
}
