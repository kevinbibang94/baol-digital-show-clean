import { useState, useEffect } from 'react'
import { feedbackEndpoint, organizerEmail } from '../data'

type Comment = {
  id: string
  author: string
  text: string
  ago: string
  likes?: number
}

const INITIAL: Comment[] = [
  { id: 'c1', author: 'Amadou', text: "Super reportage — très instructif, merci aux équipes !", ago: '2 days ago', likes: 12 },
  { id: 'c2', author: 'Fatou', text: "J'ai beaucoup aimé les interviews, très pertinentes.", ago: '5 days ago', likes: 4 },
  { id: 'c3', author: 'Moussa', text: "Peut-on retrouver les slides des conférences ?", ago: '1 week ago', likes: 1 },
]

export default function CommentsPanel() {
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const raw = localStorage.getItem('comments_local')
      if (raw) return JSON.parse(raw)
    } catch (e) {}
    return INITIAL
  })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) {
      setMsg('Le commentaire est vide')
      return
    }
    setSending(true)
    setMsg(null)

    try {
      const envEndpoint = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_FEEDBACK_ENDPOINT) || ''
      const endpoint = envEndpoint || feedbackEndpoint || ''

      if (endpoint) {
        const fd = new FormData()
        fd.append('name', name)
        fd.append('email', email)
        fd.append('comment', text)
        fd.append('page', 'Reportage : Baol Digital Show')
        const res = await fetch(endpoint, { method: 'POST', body: fd })
        if (!res.ok) throw new Error('network')
        // optimistic append
        const n = { id: String(Date.now()), author: name || 'Anonyme', text, ago: 'À l’instant', likes: 0 }
        setComments([n, ...comments])
        setName('')
        setEmail('')
        setText('')
        setMsg('Merci — commentaire ajouté')
      } else {
        // no endpoint: save locally and offer clipboard copy, avoid opening mail client
        const n = { id: String(Date.now()), author: name || 'Anonyme', text, ago: 'À l’instant', likes: 0 }
        const next = [n, ...comments]
        setComments(next)
        try {
          localStorage.setItem('comments_local', JSON.stringify(next))
        } catch (e) {}
        // copy message to clipboard so user can paste into an email if desired
        const message = [`Nom: ${name}`, `Email: ${email}`, '', text].join('\n')
        if (typeof navigator !== 'undefined' && (navigator as any).clipboard && (navigator as any).clipboard.writeText) {
          try {
            ;(navigator as any).clipboard.writeText(message)
            setMsg('Commentaire enregistré localement (copié dans le presse-papiers)')
          } catch (err) {
            setMsg('Commentaire enregistré localement')
          }
        } else {
          setMsg('Commentaire enregistré localement')
        }
        setName('')
        setEmail('')
        setText('')
      }
    } catch (err) {
      console.error(err)
      setMsg('Erreur d’envoi — réessayez')
    } finally {
      setSending(false)
    }
  }

    useEffect(() => {
      try {
        localStorage.setItem('comments_local', JSON.stringify(comments))
      } catch (e) {}
    }, [comments])

  function buildMailBody(list: Comment[]) {
    return list
      .map(c => [`Nom: ${c.author}`, `Publié: ${c.ago}`, '', c.text].join('\n'))
      .join('\n\n----\n\n')
  }

  function sendLocalCommentsByMail() {
    if (!organizerEmail) {
      setMsg('Aucun email organisateur configuré')
      return
    }
    if (!comments || comments.length === 0) {
      setMsg('Aucun commentaire à envoyer')
      return
    }
    const proceed = window.confirm('Envoyer tous les commentaires locaux par email ? Cela ouvrira votre client mail.')
    if (!proceed) return

    const subject = encodeURIComponent('Commentaires — Reportage Baol Digital Show')
    const body = encodeURIComponent(buildMailBody(comments))
    // open mail client
    window.location.href = `mailto:${organizerEmail}?subject=${subject}&body=${body}`
  }

  function exportComments() {
    try {
      const blob = new Blob([JSON.stringify(comments, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'baol-comments.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMsg('Export préparé')
    } catch (e) {
      setMsg('Échec de l’export')
    }
  }

  function importCommentsFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Comment[]
        if (!Array.isArray(parsed)) throw new Error('format')
        // prepend imported comments
        const next = [...parsed, ...comments]
        setComments(next)
        setMsg('Import réussi')
      } catch (err) {
        setMsg('Fichier invalide')
      }
    }
    reader.readAsText(f)
    // reset input
    e.currentTarget.value = ''
  }

  function clearLocalComments() {
    const ok = window.confirm('Supprimer tous les commentaires locaux ? Cette action est irréversible.')
    if (!ok) return
    try {
      localStorage.removeItem('comments_local')
    } catch (e) {}
    setComments([])
    setMsg('Commentaires locaux supprimés')
  }

  return (
    <div className="rounded-2xl border border-white/6 bg-slate-950/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-white">Commentaires</div>
        <div className="flex items-center gap-3">
          {!feedbackEndpoint && <div className="text-xs bg-yellow-600 text-slate-900 px-2 py-1 rounded">Mode local</div>}
          <div className="text-sm text-slate-300">{comments.length}</div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3 mb-4">
        <input placeholder="Nom (optionnel)" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md bg-slate-900 border border-white/6 px-3 py-2 text-sm" />
        <input placeholder="Email (optionnel)" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-md bg-slate-900 border border-white/6 px-3 py-2 text-sm" />
        <textarea placeholder="Votre commentaire" value={text} onChange={e => setText(e.target.value)} rows={3} className="w-full rounded-md bg-slate-900 border border-white/6 px-3 py-2 text-sm" />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={sending} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-900">{sending ? 'Envoi...' : 'Envoyer'}</button>
          <div className="text-sm text-slate-300">{msg}</div>
          {!feedbackEndpoint && (
            <>
              <button type="button" onClick={sendLocalCommentsByMail} className="ml-2 rounded-full border border-white/6 px-3 py-2 text-xs">Envoyer par mail</button>
              <button type="button" onClick={exportComments} className="ml-2 rounded-full border border-white/6 px-3 py-2 text-xs">Exporter (JSON)</button>
              <label className="ml-2 rounded-full border border-white/6 px-3 py-2 text-xs cursor-pointer">
                Importer
                <input type="file" accept="application/json" onChange={importCommentsFile} className="hidden" />
              </label>
              <button type="button" onClick={clearLocalComments} className="ml-2 rounded-full border border-white/6 px-3 py-2 text-xs text-rose-400">Vider</button>
            </>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-400 flex items-center justify-center text-sm font-medium text-slate-900">{c.author[0]}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{c.author}</div>
                <div className="text-xs text-slate-400">{c.ago}</div>
              </div>
              <div className="text-sm text-slate-300 mt-1">{c.text}</div>
              <div className="mt-2 text-xs text-slate-400">{c.likes ?? 0} likes</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
