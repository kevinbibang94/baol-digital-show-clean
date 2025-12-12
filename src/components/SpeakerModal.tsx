import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"


type SocialLinks = {
  facebook?: string
  linkedin?: string
  twitter?: string
  github?: string
  website?: string
}

type Speaker = {
  name: string
  title: string
  company?: string
  image?: string
  bio?: string
  socials?: SocialLinks
  // champs libres potentiels
  talkTitle?: string
  talkDescription?: string
  tags?: string[]
}

type SpeakerModalProps = {
  isOpen: boolean
  onClose: () => void
  speaker: Speaker | null
}

export default function SpeakerModal({ isOpen, onClose, speaker }: SpeakerModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Fermer avec Esc
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  // Focus sur le bouton Fermer à l’ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 0)
    }
  }, [isOpen])

  if (!isOpen || !speaker) return null

  const { name, title, company, image, bio, socials, talkTitle, talkDescription, tags } = speaker

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Détails de ${name}`}
        className="fixed inset-0 z-50 grid place-items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6 shadow-2xl"
          initial={{ y: 24, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          onClick={(e) => e.stopPropagation()} // empêche le clic intérieur de fermer
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {image && (
                <img
                  src={image}
                  alt={`Photo de ${name}`}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover border border-white/10"
                />
              )}
              <div>
                <h2 className="font-display text-lg sm:text-xl text-white">{name}</h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {title}
                  {company ? ` • ${company}` : ""}
                </p>
                {tags && tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] sm:text-xs text-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="rounded-full border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-slate-100 hover:border-brand-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Fermer
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 space-y-4">
            {bio && (
              <div>
                <h3 className="text-sm font-semibold text-brand-300">Bio</h3>
                <p className="mt-1 text-sm text-slate-200">{bio}</p>
              </div>
            )}

            {(talkTitle || talkDescription) && (
              <div>
                <h3 className="text-sm font-semibold text-brand-300">Session</h3>
                {talkTitle && (
                  <p className="mt-1 text-sm text-white font-medium">{talkTitle}</p>
                )}
                {talkDescription && (
                  <p className="mt-1 text-sm text-slate-200">{talkDescription}</p>
                )}
              </div>
            )}

            {/* Liens sociaux */}
            {socials && (
              <div>
                <h3 className="text-sm font-semibold text-brand-300">Réseaux</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {socials.website && (
                    <a
                      href={socials.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-brand-500 transition-colors"
                    >
                      Site
                    </a>
                  )}
                  {socials.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-brand-500 transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                  {socials.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-brand-500 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {socials.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-brand-500 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {socials.github && (
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-brand-500 transition-colors"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-white/20"
            >
              Fermer
            </button>
            <a
              href="mailto:marketingsolutionscenter.msc@gmail.com?subject=Proposition%20de%20session"
              className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-brand-600 transition-colors"
            >
              Proposer une session
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
