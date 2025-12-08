import { useState, useEffect } from 'react'

export default function ReportageSection() {
  const [showVideo, setShowVideo] = useState(false)
  const [likes, setLikes] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('reportage_reactions')
      if (raw) return JSON.parse(raw).likes ?? 0
    } catch (e) { }
    return 0
  })
  const [dislikes, setDislikes] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('reportage_reactions')
      if (raw) return JSON.parse(raw).dislikes ?? 0
    } catch (e) { }
    return 0
  })
  const [vote, setVote] = useState<'none' | 'like' | 'dislike'>(() => {
    try {
      const raw = localStorage.getItem('reportage_reactions')
      if (raw) return JSON.parse(raw).vote || 'none'
    } catch (e) { }
    return 'none'
  })

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setShowVideo(true)
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem('reportage_reactions', JSON.stringify({ likes, dislikes, vote }))
    } catch (e) { }
  }, [likes, dislikes, vote])
  function handleLike() {
    if (vote === 'like') {
      setLikes((s) => Math.max(0, s - 1))
      setVote('none')
    } else if (vote === 'dislike') {
      setDislikes((s) => Math.max(0, s - 1))
      setLikes((s) => s + 1)
      setVote('like')
    } else {
      setLikes((s) => s + 1)
      setVote('like')
    }
  }

  function handleDislike() {
    if (vote === 'dislike') {
      setDislikes((s) => Math.max(0, s - 1))
      setVote('none')
    } else if (vote === 'like') {
      setLikes((s) => Math.max(0, s - 1))
      setDislikes((s) => s + 1)
      setVote('dislike')
    } else {
      setDislikes((s) => s + 1)
      setVote('dislike')
    }
  }
  return (
    <div className="glass overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 min-w-0 hover:shadow-lg transition-shadow duration-200">
      <div
        className="relative w-full cursor-pointer group aspect-video"
        onClick={() => setShowVideo(true)}
        role="button"
        tabIndex={0}
        aria-label="Lire le reportage"
        onKeyDown={handleKey}
      >
        {!showVideo ? (
          <>
            <img
              src="/images/event/BAOL_Pictures4.jpg"
              alt="Reportage Baol Digital Show"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowVideo(true)
                }}
                aria-label="Lire le reportage"
                className="rounded-full bg-white/20 backdrop-blur-md p-4 group-hover:bg-white/30 transition-all duration-300"
              >
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-center sm:text-left">
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-200">Reportage</p>
              <p className="text-sm sm:text-lg font-semibold text-white">Cliquez pour voir le reportage complet</p>
            </div>
          </>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full rounded-t-2xl"
            src="https://www.youtube.com/embed/3ZP3Yh8jHZs?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1"
            title="Reportage Baol Digital Show"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
      <div className="p-4 sm:p-6 border-t border-white/6 bg-slate-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">Reportage : Baol Digital Show</div>
            <div className="text-xs text-slate-300">Publié le 20 mai 2024 • 4 min</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleLike() }}
              aria-pressed={vote === 'like'}
              className={`rounded-full px-2 py-1 text-xs sm:text-sm ${vote === 'like' ? 'bg-green-600 text-white' : 'bg-white/3 text-brand-200'}`}
            >
              👍 {likes}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleDislike() }}
              aria-pressed={vote === 'dislike'}
              className={`rounded-full px-2 py-1 text-xs sm:text-sm ${vote === 'dislike' ? 'bg-rose-600 text-white' : 'bg-white/3 text-slate-300'}`}
            >
              👎 {dislikes}
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-300 text-center sm:text-left">
          Un bref reportage présentant les moments forts, les interviews et les démonstrations. Idéal pour partager sur les réseaux ou l'intégrer dans le dossier de presse.
        </p>
        <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
            {/* Twitter */}
            <a
              className="text-brand-500 hover:text-white p-2 rounded-full bg-white/3"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Reportage Baol Digital Show')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur Twitter"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="block">
                <path d="M22 5.92c-.64.29-1.32.5-2.04.59a3.55 3.55 0 0 0-6.06 2.43c0 .28.03.56.09.82A10.08 10.08 0 0 1 3 4.88a3.55 3.55 0 0 0 1.1 4.73 3.45 3.45 0 0 1-1.6-.44v.04c0 1.9 1.35 3.5 3.14 3.86-.33.09-.67.13-1.03.13-.25 0-.5-.02-.74-.07.5 1.56 1.93 2.7 3.63 2.73A7.12 7.12 0 0 1 2 19.54 10.06 10.06 0 0 0 7.29 21c6.2 0 9.6-5.13 9.6-9.58v-.44c.66-.47 1.2-1.06 1.64-1.74-.6.27-1.24.44-1.9.52.69-.42 1.22-1.08 1.47-1.86-.65.38-1.36.66-2.12.81z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              className="text-blue-600 hover:text-white p-2 rounded-full bg-white/3"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur Facebook"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="block">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.5v-3h2V9.3c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.62-1.3 1.3V12h2.2l-.35 3H13v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              className="text-sky-600 hover:text-white p-2 rounded-full bg-white/3"
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent('Reportage Baol Digital Show')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Partager sur LinkedIn"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="block">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 .02 0zM3 8.98h4v12H3zM9 8.98h3.8v1.64h.06c.53-1 1.82-2.04 3.76-2.04 4.02 0 4.76 2.65 4.76 6.09v6.3H19v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.68H11V8.98z" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
