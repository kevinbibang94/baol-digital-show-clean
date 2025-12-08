import { useEffect, useRef, useState } from 'react'
import type { partners as _partners } from '../data'

export default function PartnerCarousel({ partners }: { partners: typeof _partners }) {
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(5)
  const hoverRef = useRef(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w >= 1024) setPerView(5)
      else if (w >= 768) setPerView(3)
      else setPerView(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const items = Array.from({ length: 10 }).map((_, i) => partners[i % partners.length])
  const maxIndex = Math.max(0, items.length - perView)

  function prev() {
    setIndex((s) => Math.max(0, s - 1))
  }
  function next() {
    setIndex((s) => Math.min(maxIndex, s + 1))
  }

  // autoplay
  useEffect(() => {
    // clear any existing
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(() => {
      if (hoverRef.current) return
      setIndex((s) => (s >= maxIndex ? 0 : s + 1))
    }, 3000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [maxIndex])

  return (
    <div onMouseEnter={() => (hoverRef.current = true)} onMouseLeave={() => (hoverRef.current = false)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm font-semibold text-slate-300">Nos partenaires</div>
        <div className="ml-auto flex gap-2">
          <button aria-label="Précédent" onClick={prev} className="rounded-full bg-white/6 p-2 hover:bg-white/10">
            ‹
          </button>
          <button aria-label="Suivant" onClick={next} className="rounded-full bg-white/6 p-2 hover:bg-white/10">
            ›
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(index * 100) / perView}%)` }}
        >
          {items.map((p, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center p-4" style={{ width: `${100 / perView}%` }}>
              <div className="w-full max-w-xs flex items-center justify-center bg-white/6 p-3 rounded-md">
                <img src={p.logo} alt={p.name} className="max-h-14 object-contain transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
