export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-xl mx-auto px-6 py-16">
        <a href="/" className="text-text-muted text-sm hover:text-amber-warm transition-colors">&larr; Back to app</a>
        <h1 className="font-display text-3xl tracking-wider text-text-primary uppercase mt-8 mb-10">Terms of Service</h1>

        <Section title="Service">
          "Do I Know This Artist?" is a free tool that lets you search your YouTube playlists for artists and tracks. It is provided as-is, with no warranties.
        </Section>

        <Section title="Your account">
          You sign in with your Google account. You are responsible for maintaining the security of your account. We only request read-only access to your YouTube data.
        </Section>

        <Section title="Acceptable use">
          Use this service for its intended purpose: searching your own playlists. Do not attempt to abuse the service or access other users' data.
        </Section>

        <Section title="Limitation of liability">
          This is a personal project provided for free. We are not liable for any damages arising from the use of this service.
        </Section>

        <Section title="Changes">
          We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.
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
