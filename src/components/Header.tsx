import { Link } from 'react-router-dom'
import { useState } from 'react'
import { googleFormUrl } from '../data'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="container flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <img
            src="/images/logo.png"
            alt="Logo Baol Digital Show"
            className="h-10 w-auto sm:h-14 md:h-16 rounded-lg"
          />
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-400">
              Baol Digital Show
            </p>
            <p className="text-xs sm:text-sm text-slate-200">Dakar • 2024</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 text-xs sm:text-sm font-medium">
          <Link to="/" className="hover:text-brand-300 transition-colors">Accueil</Link>
          <Link to="/programme" className="hover:text-brand-300 transition-colors">Programme</Link>
          <Link to="/intervenants" className="hover:text-brand-300 transition-colors">Intervenants</Link>
          <Link to="/contact" className="hover:text-brand-300 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            className="rounded-full bg-brand-500 px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-900 shadow-glow transition hover:bg-brand-400 flex-shrink-0 whitespace-nowrap"
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span className="sm:hidden">S'inscrire</span>
            <span className="hidden sm:inline">Je m'inscris</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden border-t border-white/5 bg-slate-950 py-3">
          <div className="container space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">Accueil</Link>
            <Link to="/programme" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">Programme</Link>
            <Link to="/intervenants" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">Intervenants</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">Contact</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
