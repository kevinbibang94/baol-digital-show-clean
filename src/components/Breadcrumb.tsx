// src/components/Breadcrumb.tsx
import { NavLink, useLocation } from "react-router-dom"
import {
  HomeIcon,
  CalendarIcon,
  MicrophoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline"
import { useEffect, useState, useRef } from "react"

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  // Animation d’apparition du breadcrumb
  const [animate, setAnimate] = useState(false)

  // Ref pour contrôler le scroll horizontal de la liste
  const scrollRef = useRef<HTMLOListElement>(null)

  // Afficher le bouton “scroll to start” quand on a scrol lé à droite
  const [showScrollStart, setShowScrollStart] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 500)
    return () => clearTimeout(timer)
  }, [location])

  // Scroll automatique vers la droite à chaque changement de route
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({
      left: el.scrollWidth,
      behavior: "smooth",
    })
  }, [location])

  // Détecter quand on doit montrer le bouton "scroll to start"
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      // Si on est un peu scrol lé vers la droite, on montre le bouton
      setShowScrollStart(el.scrollLeft > 20)
    }

    // Aussi: si le breadcrumb est plus large que le conteneur (donc “trop long”),
    // le scroll horizontal existe; le bouton s’affichera dès qu’on scrol le.
    el.addEventListener("scroll", handleScroll)
    // Initialiser l’état au montage
    handleScroll()

    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  // Icônes premium avec badges dégradés + glow
  const icons: Record<string, JSX.Element> = {
    programme: (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.6)]">
        <CalendarIcon className="w-4 h-4 text-white" />
      </span>
    ),
    intervenants: (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 animate-pulse shadow-[0_0_10px_rgba(192,132,252,0.6)]">
        <MicrophoneIcon className="w-4 h-4 text-white" />
      </span>
    ),
    contact: (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-lime-400 animate-pulse shadow-[0_0_10px_rgba(132,204,22,0.6)]">
        <EnvelopeIcon className="w-4 h-4 text-white" />
      </span>
    ),
  }

  return (
    <nav
      className={`relative text-sm px-4 py-2 bg-slate-950/60 backdrop-blur-md border-b border-white/5 
      transition-all duration-500 ease-in-out 
      ${animate ? "opacity-0 -translate-x-4 translate-y-2" : "opacity-100 translate-x-0 translate-y-0"}`}
    >
      {/* Bouton "scroll to start" — revient au début du fil d’Ariane */}
      {showScrollStart && (
        <button
          onClick={() => scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" })}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800/80 p-1 rounded-full shadow hover:bg-slate-700 transition"
          aria-label="Revenir au début du fil d’Ariane"
        >
          <ChevronLeftIcon className="w-4 h-4 text-slate-200" />
        </button>
      )}

      <ol
        ref={scrollRef}
        className="flex items-center gap-2 text-slate-400 overflow-x-auto scrollbar-hide whitespace-nowrap"
      >
        {/* Accueil */}
        <li className="flex items-center gap-1 flex-shrink-0">
          <NavLink to="/" className="flex items-center gap-1 hover:text-brand-400">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              <HomeIcon className="w-4 h-4 text-slate-900" />
            </span>
            <span>Accueil</span>
          </NavLink>
        </li>

        {/* Segments dynamiques */}
        {pathnames.map((segment, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/")
          const isLast = index === pathnames.length - 1
          return (
            <li key={routeTo} className="flex items-center gap-1 flex-shrink-0">
              <span className="text-slate-500">›</span>
              {isLast ? (
                <span className="flex items-center gap-1 text-slate-200 capitalize">
                  {icons[segment] ?? <span className="w-6 h-6 rounded-full bg-slate-700" />}
                  {segment}
                </span>
              ) : (
                <NavLink
                  to={routeTo}
                  className="flex items-center gap-1 hover:text-brand-400 capitalize"
                >
                  {icons[segment] ?? <span className="w-6 h-6 rounded-full bg-slate-700" />}
                  {segment}
                </NavLink>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
