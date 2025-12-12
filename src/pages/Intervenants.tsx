import { motion } from "framer-motion"
import { useState } from "react"
import { speakers } from "../data"
import SpeakerModal from "../components/SpeakerModal"

export default function IntervenantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpeaker, setSelectedSpeaker] = useState(null)

  const filteredSpeakers = speakers.filter(
    (speaker) =>
      speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main>
      <section className="border-b border-white/5 bg-slate-900/30 py-10 sm:py-12 lg:py-16">
        <div className="container space-y-6 sm:space-y-8 lg:space-y-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-300">
                Intervenants
              </p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl">
                Des profils tech, design & business
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-slate-300">
                Un mix de talks, cas concrets et ateliers guidés par des praticiens.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                className="rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition hover:bg-white/20 self-start lg:self-auto"
                href="mailto:marketingsolutionscenter.msc@gmail.com"
              >
                Proposer une session
              </a>
            </div>
          </div>

          <div className="max-w-md">
            <input
              type="text"
              placeholder="Rechercher un intervenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <p className="text-xs sm:text-sm text-slate-400 mb-4">
              {filteredSpeakers.length} intervenant
              {filteredSpeakers.length !== 1 ? "s" : ""} trouvé
              {filteredSpeakers.length !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSpeakers.map((speaker, index) => (
                <motion.article
                  key={speaker.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                  onClick={() => setSelectedSpeaker(speaker)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Voir détails de ${speaker.name}`}
                  className="glass relative flex h-full flex-col gap-2 sm:gap-3 rounded-2xl overflow-hidden p-4 sm:p-5 
                             hover:scale-[1.02] hover:shadow-[0_0_12px_theme(colors.brand.400)] transition-transform duration-200 cursor-pointer"
                >
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4 text-xs text-brand-300">
                    #{index + 1}
                  </div>
                  <div className="relative h-40 sm:h-32 w-full overflow-hidden rounded-xl mb-2">
                    <img
                      src={speaker.image}
                      alt={`Photo de ${speaker.name}`}
                      aria-label={`Photo de ${speaker.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg">{speaker.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {speaker.title}
                      {speaker.company && ` • ${speaker.company}`}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200">{speaker.bio}</p>
                  <div className="flex gap-2 mt-4">
                    {speaker.facebook && (
                      <a
                        href={speaker.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-500 transition-colors"
                        aria-label="Facebook"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    {speaker.linkedin && (
                      <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-500 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.725-2.004 1.426-.103.25-.129.599-.129.948v5.431h-3.554s.047-8.811 0-9.728h3.554v1.375c.421-.65 1.175-1.575 2.857-1.575 2.087 0 3.653 1.362 3.653 4.291v5.637zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.704 0-.952.768-1.703 1.96-1.703 1.188 0 1.913.75 1.938 1.703 0 .946-.75 1.704-1.983 1.704zm1.946 11.597H3.392V9.724h3.891v10.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Modal pour afficher les détails */}
          <SpeakerModal
            isOpen={!!selectedSpeaker}
            onClose={() => setSelectedSpeaker(null)}
            speaker={selectedSpeaker}
          />
        </div>
      </section>
    </main>
  )
}
