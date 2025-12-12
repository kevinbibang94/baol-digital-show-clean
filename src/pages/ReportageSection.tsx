import { useState, useEffect } from "react"
import "../components/ReportageSection.css"; // <-- Import du fichier CSS premium
import {
  fetchReportageStats,
  incrementReportageViews,
  updateReportageReactions,
  subscribeReportageStats,
} from "../lib/supabaseClient"

export default function ReportageSection() {
  const [showVideo, setShowVideo] = useState(false)

  const [views, setViews] = useState(0)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [loading, setLoading] = useState(false)

  const [vote, setVote] = useState<"none" | "like" | "dislike">(() => {
    try {
      const raw = localStorage.getItem("reportage_vote")
      if (raw) return JSON.parse(raw)
    } catch {}
    return "none"
  })
  useEffect(() => {
    let mounted = true

    async function fetchStats() {
      setLoading(true)
      const { data, error } = await fetchReportageStats()
      if (!error && data && mounted) {
        setViews(data.views ?? 0)
        setLikes(data.likes ?? 0)
        setDislikes(data.dislikes ?? 0)
      }
      setLoading(false)
    }

    fetchStats()

    // Abonnement en temps réel
    const unsubscribe = subscribeReportageStats((updated) => {
      setViews(updated.views)
      setLikes(updated.likes)
      setDislikes(updated.dislikes)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  async function launchVideo() {
    setShowVideo(true)

    const alreadyViewed = localStorage.getItem("reportage_viewed_once")
    if (alreadyViewed === "true") return

    const { data, error } = await incrementReportageViews(views)
    if (!error && data?.[0]) {
      setViews(data[0].views ?? views + 1)
      localStorage.setItem("reportage_viewed_once", "true")
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      launchVideo()
    }
  }
  function persistVote(v: "none" | "like" | "dislike") {
    setVote(v)
    try {
      localStorage.setItem("reportage_vote", JSON.stringify(v))
    } catch {}
  }

  // Like avec transitions (none→like, dislike→like, like→none)
  async function handleLike() {
    let newLikes = likes
    let newDislikes = dislikes
    let nextVote: "none" | "like" | "dislike" = vote

    if (vote === "like") {
      newLikes = Math.max(0, likes - 1)
      nextVote = "none"
    } else if (vote === "dislike") {
      newDislikes = Math.max(0, dislikes - 1)
      newLikes = likes + 1
      nextVote = "like"
    } else {
      newLikes = likes + 1
      nextVote = "like"
    }

    setLikes(newLikes)
    setDislikes(newDislikes)
    persistVote(nextVote)

    const { data, error } = await updateReportageReactions(newLikes, newDislikes)
    if (!error && data?.[0]) {
      setLikes(data[0].likes ?? newLikes)
      setDislikes(data[0].dislikes ?? newDislikes)
    }
  }

  // Dislike avec transitions (none→dislike, like→dislike, dislike→none)
  async function handleDislike() {
    let newLikes = likes
    let newDislikes = dislikes
    let nextVote: "none" | "like" | "dislike" = vote

    if (vote === "dislike") {
      newDislikes = Math.max(0, dislikes - 1)
      nextVote = "none"
    } else if (vote === "like") {
      newLikes = Math.max(0, likes - 1)
      newDislikes = dislikes + 1
      nextVote = "dislike"
    } else {
      newDislikes = dislikes + 1
      nextVote = "dislike"
    }

    setLikes(newLikes)
    setDislikes(newDislikes)
    persistVote(nextVote)

    const { data, error } = await updateReportageReactions(newLikes, newDislikes)
    if (!error && data?.[0]) {
      setLikes(data[0].likes ?? newLikes)
      setDislikes(data[0].dislikes ?? newDislikes)
    }
  }
  return (
    <div className="glass overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 min-w-0 hover:shadow-lg transition-shadow duration-200">
      <div
        className="thumbnail relative w-full cursor-pointer group aspect-video"
        onClick={launchVideo}
        role="button"
        tabIndex={0}
        aria-label="Lire le reportage"
        onKeyDown={handleKey}
      >
        {!showVideo ? (
          <>
            <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
              <img
                src="/images/event/BAOL_Pictures4.jpg"
                alt="Reportage Baol Digital Show"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 transform-gpu group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  launchVideo()
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
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-200">
                Reportage
              </p>
              <p className="text-sm sm:text-lg font-semibold text-white">
                Cliquez pour voir le reportage complet
              </p>
            </div>
          </>
        ) : (
          <iframe
            className="video-frame absolute inset-0 w-full h-full rounded-t-2xl"
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
            <div className="text-sm font-semibold text-white">
              Reportage : Baol Digital Show
            </div>
            <div className="text-xs text-slate-300">
              Publié le 20 mai 2024 • 4 min
            </div>
            <div className="mt-1 text-xs text-slate-400">
              <span className={`views-counter ${showVideo ? "updated" : ""}`}>
                👁️ {views} vues
              </span>
              • 👍 {likes} • 👎 {dislikes}
              {loading && (
                <span className="ml-2 text-[11px] text-slate-500">(maj...)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleLike()
              }}
              aria-pressed={vote === "like"}
              disabled={loading}
              className={`like-button rounded-full px-2 py-1 text-xs sm:text-sm ${
                vote === "like"
                  ? "bg-green-600 text-white voted"
                  : "bg-white/3 text-brand-200"
              }`}
            >
              👍 {likes}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleDislike()
              }}
              aria-pressed={vote === "dislike"}
              disabled={loading}
              className={`dislike-button rounded-full px-2 py-1 text-xs sm:text-sm ${
                vote === "dislike"
                  ? "bg-rose-600 text-white voted"
                  : "bg-white/3 text-slate-300"
              }`}
            >
              👎 {dislikes}
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-300 text-center sm:text-left">
          Un bref reportage présentant les moments forts, les interviews et les
          démonstrations. Idéal pour partager sur les réseaux ou l'intégrer dans
          le dossier de presse.
        </p>

        {/* Boutons de partage (Twitter, Facebook, LinkedIn) */}
        <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
          {/* ... tes boutons de partage existants ... */}
        </div>
      </div>
    </div>
  )
}
        
