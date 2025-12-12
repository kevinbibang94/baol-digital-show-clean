import { NavLink } from "react-router-dom"
import { useState } from "react"
import { googleFormUrl } from "../data"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="container flex items-center justify-between gap-3 py-3 sm:py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium" role="navigation">
          {[
            { to: "/", label: "Accueil" },
            { to: "/programme", label: "Programme" },
            { to: "/intervenants", label: "Intervenants" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative transition-colors duration-300 ease-in-out ${
                  isActive ? "text-brand-400 font-semibold" : "text-slate-200 hover:text-brand-300"
                } 
                after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-gradient-to-r from-brand-400 to-brand-500
                after:origin-left after:scale-x-0 after:transition-transform after:duration-500 after:ease-in-out 
                ${isActive ? "after:scale-x-100" : "hover:after:scale-x-100"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bouton inscription + menu mobile */}
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

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 transition-transform duration-300 ease-in-out"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12" // croix
                    : "M4 6h16M4 12h16M4 18h16" // burger
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation avec animation */}
      <nav
        className={`lg:hidden border-t border-white/5 bg-slate-950 transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden"
        }`}
        role="navigation"
      >
        <div className="container space-y-2">
          {[
            { to: "/", label: "Accueil" },
            { to: "/programme", label: "Programme" },
            { to: "/intervenants", label: "Intervenants" },
            { to: "/contact", label: "Contact" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive
                    ? "bg-brand-500 text-slate-900 font-semibold"
                    : "hover:bg-white/10 text-slate-200"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
