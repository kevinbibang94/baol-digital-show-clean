import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { gallery, googleFormUrl, partners } from '../data'
import PartnerCarousel from './PartnerCarousel'
import ReportageSection from './ReportageSection'
import CommentsPanel from '../components/CommentsPanel'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gallery.length)
    }, 4800)
    return () => clearInterval(id)
  }, [])

  return (
    <main className="overflow-x-hidden">
      <section className="relative overflow-hidden border-b border-white/5 w-full max-w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-700/10 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 opacity-50">
          <div className="pointer-events-none absolute inset-0 bg-grid" />
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/event/poster.jpg"
          >
            <source src="/videos/presentation.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="container relative grid gap-6 sm:gap-8 lg:gap-10 py-8 sm:py-12 lg:py-16 lg:grid-cols-2 lg:items-center min-w-0">
          <div className="space-y-4 sm:space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-200"
            >
              16 au 19 mai 2024 | Dakar
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
            >
              Le rendez-vous des équipes qui construisent le digital
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-2xl text-base sm:text-lg text-slate-300"
            >
              Talks, ateliers et démos live pour designers, développeurs,
              produits et marketing. Une journée pour partager pratiques,
              outils et rencontres.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <a
                className="rounded-full bg-brand-500 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-400"
                href={googleFormUrl}
                target="_blank"
                rel="noreferrer"
              >
                Réserver ma place
              </a>
              <a
                className="rounded-full border border-white/15 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-brand-400/60"
                href="/programme"
              >
                Voir le programme
              </a>
            </motion.div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              {['Talks & panels', 'Workshops live', 'Espace démo'].map(
                (item) => (
                  <div
                    key={item}
                    className="glass rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <img
              src={gallery[currentSlide]}
              alt="Aperçu de l'événement"
              loading="lazy"
              className="w-full aspect-video object-cover max-w-full"
            />
            <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-6 z-10">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-slate-300">
                  Ambiance
                </p>
                <div className="flex gap-2">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 w-4 sm:w-6 rounded-full transition ${
                        i === currentSlide
                          ? 'bg-brand-400'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Aller au visuel ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm sm:text-lg font-semibold">
                Expériences immersives, rencontres et live coding.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-slate-950 py-10 sm:py-12 lg:py-16">
        <div className="container min-w-0">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-300">Partenaires</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl">Ils soutiennent l'édition</h2>
            <p className="max-w-2xl text-sm sm:text-base text-slate-300">Un écosystème de studios, SaaS, médias et communautés qui contribuent au contenu, aux ateliers et à l'expérience live.</p>
          </div>
          <div className="mt-6">
            <PartnerCarousel partners={partners} />
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-12 lg:py-16">
        <div className="container min-w-0">
          <h3 className="text-sm text-brand-300 uppercase tracking-[0.2em] mb-4">Reportage</h3>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportageSection />
            </div>
            <aside className="lg:col-span-1 hidden lg:block space-y-4">
              <div className="rounded-2xl border border-white/6 p-4 bg-slate-950/40 text-sm text-slate-300">
                <h4 className="font-semibold text-white mb-2">À propos du reportage</h4>
                <p>Un court reportage présentant les moments forts et les interviews des organisateurs et participants. Cliquez sur la vignette pour lancer la vidéo.</p>
              </div>
              <CommentsPanel />
            </aside>
            {/* small screens: show about + comments below the reportage */}
            <div className="lg:hidden mt-6 space-y-4">
              <div className="rounded-2xl border border-white/6 p-4 bg-slate-950/40 text-sm text-slate-300">
                <h4 className="font-semibold text-white mb-2">À propos du reportage</h4>
                <p>Un court reportage présentant les moments forts et les interviews des organisateurs et participants. Cliquez sur la vignette pour lancer la vidéo.</p>
              </div>
              <CommentsPanel />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
