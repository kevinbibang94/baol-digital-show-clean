import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { ProgramItem, Speaker } from '../data'

type Props = {
  isOpen: boolean
  onClose: () => void
  item: ProgramItem | null
  speakersData: Speaker[]
  reserveUrl: string
}

export default function Modal({ isOpen, onClose, item, speakersData, reserveUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastActive = useRef<Element | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      lastActive.current = document.activeElement
      document.addEventListener('keydown', onKey)
      // focus the modal
      setTimeout(() => {
        const first = containerRef.current?.querySelector<HTMLElement>('button, [href], input, [tabindex]')
        first?.focus()
      }, 0)
    }

    return () => {
      document.removeEventListener('keydown', onKey)
      // restore focus
      if (lastActive.current instanceof HTMLElement) (lastActive.current as HTMLElement).focus()
    }
  }, [isOpen, onClose])

  // focus trap
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const container = containerRef.current
      if (!container) return
      const focusable = Array.from(container.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  if (!isOpen || !item) return null

  const linkedSpeakers = (item.speakers || []).map(name => speakersData.find(s => s.name === name)).filter(Boolean) as Speaker[]

  function makeICS(it: ProgramItem) {
    // Use event start date as May 16, 2024 and duration 60 minutes for demo
    const date = '20240516'
    const start = (it.time || '09:00').replace(':', '')
    const dtstart = `${date}T${start}00`
    const dtend = `${date}T${String(Number(start) + 100).padStart(4, '0')}00`
    const uid = `${it.title.replace(/\s+/g, '-')}-${dtstart}@baoldigitalshow`
    return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//baol//baol-digital-show//FR\nCALSCALE:GREGORIAN\nBEGIN:VEVENT\nUID:${uid}\nSUMMARY:${it.title}\nDTSTART:${dtstart}\nDTEND:${dtend}\nDESCRIPTION:${it.description}\nEND:VEVENT\nEND:VCALENDAR`
  }

  function downloadICS(it: ProgramItem) {
    const content = makeICS(it)
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${it.title.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative w-full h-screen mx-0 bg-slate-900 rounded-none overflow-auto shadow-2xl border border-white/10 lg:rounded-2xl lg:mx-4 lg:max-w-4xl lg:h-auto"
        ref={containerRef}
      >
        <div className="grid lg:grid-cols-2">
          {item.image && (
            <div className="hidden lg:block">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="modal-title" className="text-2xl font-display font-semibold text-white">{item.title}</h2>
                <p className="text-sm text-slate-300 mt-1">{item.time}</p>
              </div>
              <button onClick={onClose} className="text-slate-300 hover:text-white p-2 rounded-md">✕</button>
            </div>

            <p className="mt-4 text-sm text-slate-300">{item.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(item.tags || []).map(tag => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">{tag}</span>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white mb-3">Intervenants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedSpeakers.length ? linkedSpeakers.map(s => (
                  <div key={s.name} className="flex items-center gap-3 bg-white/3 p-3 rounded-lg">
                    <img src={s.image} alt={s.name} className="w-12 h-12 object-cover rounded-md" />
                    <div>
                      <div className="font-semibold text-sm text-white">{s.name}</div>
                      <div className="text-xs text-slate-300">{s.title}{s.company ? ` • ${s.company}` : ''}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-slate-300">Aucun intervenant spécifié pour cette session.</div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a href={reserveUrl} target="_blank" rel="noreferrer" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-brand-400 transition">Réserver / S'inscrire</a>
              <button onClick={() => downloadICS(item)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Ajouter au calendrier</button>
              <button onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Fermer</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
