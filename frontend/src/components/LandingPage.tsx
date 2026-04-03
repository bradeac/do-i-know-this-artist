import { motion } from 'motion/react'

interface LandingPageProps {
  onSignIn: () => void
}

function VinylRecord({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="195" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      <circle cx="200" cy="200" r="155" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.3" opacity="0.06" />
      <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <circle cx="200" cy="200" r="55" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <circle cx="200" cy="200" r="20" fill="currentColor" opacity="0.08" />
      <circle cx="200" cy="200" r="6" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-amber-warm/30 text-amber-warm text-xs font-medium shrink-0">
      {n}
    </span>
  )
}

export default function LandingPage({ onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        {/* Background vinyl */}
        <div className="absolute -right-32 -top-20 w-125 h-125 text-amber-warm pointer-events-none select-none opacity-40 vinyl-spin-slow">
          <VinylRecord className="w-full h-full" />
        </div>

        <div className="relative max-w-2xl mx-auto px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-0.5 bg-amber-warm mb-8" />
            <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-text-primary uppercase leading-tight">
              Do I Know<br />This Artist?
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 text-text-secondary text-lg font-light leading-relaxed max-w-md"
          >
            Search across all your YouTube playlists to instantly find if you already know an artist or track.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onClick={onSignIn}
            className="mt-10 px-8 py-3.5 bg-amber-warm text-black font-medium rounded-xl hover:bg-amber-glow transition-all duration-300 text-sm tracking-wide uppercase"
          >
            Sign in with Google
          </motion.button>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto w-full px-8">
        <div className="h-px bg-linear-to-r from-transparent via-border-warm to-transparent" />
      </div>

      {/* Use case */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-text-muted text-[10px] tracking-[0.25em] uppercase mb-4">Why</p>
          <p className="text-text-secondary font-light leading-relaxed max-w-lg">
            You spot a name on a festival lineup and it sounds familiar.
            Or you remember saving a song somewhere but can't find which playlist.
            Instead of scrolling through dozens of playlists — just search.
          </p>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto w-full px-8">
        <div className="h-px bg-linear-to-r from-transparent via-border-warm to-transparent" />
      </div>

      {/* How it works */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-text-muted text-[10px] tracking-[0.25em] uppercase mb-8">How it works</p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <StepNumber n={1} />
              <div>
                <p className="text-text-primary text-sm font-medium">Connect your YouTube</p>
                <p className="text-text-secondary text-sm font-light mt-1">Sign in with Google for read-only access to your playlists.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <StepNumber n={2} />
              <div>
                <p className="text-text-primary text-sm font-medium">Tracks are cached locally</p>
                <p className="text-text-secondary text-sm font-light mt-1">All your tracks are loaded once and stored in your browser. Nothing is sent to our servers.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <StepNumber n={3} />
              <div>
                <p className="text-text-primary text-sm font-medium">Search instantly</p>
                <p className="text-text-secondary text-sm font-light mt-1">Type an artist or track name and get results across all your playlists.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-2xl mx-auto w-full px-8">
        <div className="h-px bg-linear-to-r from-transparent via-border-warm to-transparent" />
      </div>

      {/* Privacy & CTA */}
      <section className="max-w-2xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8"
        >
          <div>
            <p className="text-text-muted text-[10px] tracking-[0.25em] uppercase mb-4">Privacy</p>
            <p className="text-text-secondary text-sm font-light leading-relaxed max-w-sm">
              Your data never leaves your browser. We request read-only access and store nothing on our servers.
              Read our <a href="/privacy" className="text-amber-warm hover:text-amber-glow transition-colors">privacy policy</a>.
            </p>
          </div>

          <button
            onClick={onSignIn}
            className="shrink-0 px-8 py-3.5 bg-amber-warm text-black font-medium rounded-xl hover:bg-amber-glow transition-all duration-300 text-sm tracking-wide uppercase"
          >
            Get started
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-subtle py-6 text-center text-xs text-text-secondary">
        <span>Built by </span>
        <a href="https://bradeac.dev" target="_blank" rel="noopener noreferrer" className="text-amber-warm hover:text-amber-glow transition-colors">bradeac.dev</a>
        <span className="mx-2 text-border-warm">/</span>
        <span>For more features, try also </span>
        <a href="https://music.bradeac.dev" target="_blank" rel="noopener noreferrer" className="text-amber-warm hover:text-amber-glow transition-colors">music.bradeac.dev</a>
        <span className="mx-2 text-border-warm">/</span>
        <a href="/privacy" className="hover:text-amber-warm transition-colors">Privacy Policy</a>
        <span className="mx-2 text-border-warm">/</span>
        <a href="/terms" className="hover:text-amber-warm transition-colors">Terms and Agreements</a>
      </footer>
    </div>
  )
}
