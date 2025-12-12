import { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { program, googleFormUrl, speakers, type ProgramItem } from "../data"
import Modal from "../components/Modal"

// simple module-level cache so we don't fetch placeholders repeatedly
let __placeholdersCache: Record<string, string> | undefined = undefined
async function fetchPlaceholders(): Promise<Record<string, string> | undefined> {
  if (__placeholdersCache) return __placeholdersCache
  try {
    const res = await fetch("/images/generated/placeholders.json")
    if (!res.ok) {
      __placeholdersCache = {}
      return __placeholdersCache
    }
    __placeholdersCache = await res.json()
    return __placeholdersCache
  } catch {
    __placeholdersCache = {}
    return __placeholdersCache
  }
}

function Thumbnail({
  src,
  alt,
  className,
  sizes,
}: {
  src: string
  alt: string
  className?: string
  sizes?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [placeholder, setPlaceholder] = useState<string | undefined>(undefined)

  const parts = src.split("/")
  const filename = parts[parts.length - 1]
  const baseName = filename.replace(/\.[^.]+$/, "")
  const generatedBase = "/images/generated/" + baseName
  const widths = [400, 800, 1200]
  const avifSet = widths.map((w) => `${generatedBase}-${w}.avif ${w}w`).join(", ")
  const webpSet = widths.map((w) => `${generatedBase}-${w}.webp ${w}w`).join(", ")

  useEffect(() => {
    let mounted = true
    fetchPlaceholders().then((map) => {
      if (!mounted || !map) return
      const p = (map as Record<string, string>)[baseName]
      if (p) setPlaceholder(p)
    })
    return () => {
      mounted = false
    }
  }, [baseName])

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-slate-800 ${
        className || ""
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400`}
      style={{ minWidth: 0 }}
    >
      {placeholder && (
        <div
          aria-hidden
          className={`absolute inset-0 bg-cover bg-center transform scale-105 filter transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(${placeholder})`,
            WebkitFilter: "blur(8px)",
            filter: "blur(8px)",
          }}
        />
      )}
      <picture>
        <source type="image/avif" srcSet={avifSet} sizes={sizes} />
        <source type="image/webp" srcSet={webpSet} sizes={sizes} />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </picture>
    </div>
  )
}
export default function ProgrammePage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<ProgramItem | null>(null)

  // Effet parallax sur les images
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let rafId = 0
    function onScroll() {
      rafId = requestAnimationFrame(() => {
        const nodes = document.querySelectorAll<HTMLImageElement>("[data-parallax]")
        nodes.forEach((img) => {
          const rect = img.getBoundingClientRect()
          const windowH = window.innerHeight
          const ratio = (rect.top + rect.height / 2 - windowH / 2) / (windowH / 2)
          const translate = Math.max(-1, Math.min(1, ratio)) * 12
          img.style.transform = `translateY(${translate}px)`
        })
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // Tags et filtres
  const allTags = Array.from(new Set(program.flatMap((item: ProgramItem) => item.tags))) as string[]
  const filteredProgram = selectedTag
    ? program.filter((item: ProgramItem) => item.tags.includes(selectedTag))
    : program

  // Ligne verticale animée au scroll
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <main>
      <section className="border-b border-white/5 bg-slate-950/60 py-10 sm:py-12 lg:py-16">
        <div className="container space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-300">
                Programme
              </p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl">
                Une journée pour apprendre et tester
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-slate-300">
                Talks inspirationnels le matin, ateliers pratiques l'après-midi
                et démos live pour repartir avec des idées concrètes.
              </p>
            </div>
            <a
              className="rounded-full border border-white/15 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-100 transition hover:border-brand-400/60 self-start lg:self-auto"
              href={googleFormUrl}
              target="_blank"
              rel="noreferrer"
            >
              Télécharger l'agenda
            </a>
          </div>

          {/* Filtres */}
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-300">
              Filtrer par catégorie :
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                  selectedTag === null
                    ? "bg-brand-500 text-slate-900"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                Tous
              </button>
              {allTags.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                    selectedTag === tag
                      ? "bg-brand-500 text-slate-900"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {/* Timeline avec ligne animée */}
          <div className="space-y-8 relative">
            {/* Ligne verticale animée */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-2 sm:left-3 top-0 bottom-0 w-[2px] bg-brand-400 origin-top"
            />

            <ol className="relative pl-6 sm:pl-8">
              {filteredProgram.map((item, index) => (
                <motion.li
                  key={item.title}
                  className="mb-8 relative"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.1, ease: "easeOut" }}
                >
                  {/* Point sur la timeline */}
                  <span className="absolute -left-3 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-slate-900">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 7V12L15 14" stroke="#081018" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="9" stroke="#081018" strokeWidth="1.6" />
                    </svg>
                  </span>

                  {/* Carte interactive */}
                  <div
                    onClick={() => setSelectedItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedItem(item)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Voir détails de ${item.title}`}
                    className="ml-6 sm:ml-8 cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 group-hover:scale-102 group-hover:shadow-[0_0_12px_theme(colors.brand.400)] transition-transform duration-200">
                      {item.image && (
                        <Thumbnail
                          src={item.image}
                          alt={item.title}
                          className="w-full sm:w-48 h-28 sm:h-32 rounded-lg"
                          sizes="(max-width: 640px) 100vw, 200px"
                        />
                      )}

                      <div className="flex-1">
                        <div className="text-sm font-semibold text-brand-300">{item.time}</div>
                        <h3 className="font-display text-lg sm:text-2xl text-white mt-1">{item.title}</h3>
                        <p className="text-sm text-slate-300 mt-2">{item.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((t: string) => (
                            <span
                              key={t}
                              className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
          {/* Modal pour afficher les détails */}
          <Modal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            item={selectedItem}
            speakersData={speakers}
            reserveUrl={googleFormUrl}
          />
        </div>
      </section>
    </main>
  )
}
