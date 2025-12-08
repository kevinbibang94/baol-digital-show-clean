import { useState, useEffect } from 'react'
import { feedbackEndpoint } from '../data'

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
      const envEndpoint =
        (typeof import.meta !== 'undefined' &&
          (import.meta as any).env &&
          (import.meta as any).env.VITE_FEEDBACK_ENDPOINT) ||
        ''
      const endpoint = envEndpoint || feedbackEndpoint || ''

      if (endpoint) {
        const fd = new FormData()
        fd.append('name', name)
        fd.append('email', email)
        fd.append('comment', text)
        fd.append('page', 'Reportage : Baol Digital Show')
        const res = await fetch(endpoint, { method: 'POST', body: fd })
        if (!res.ok) throw new Error('network')
        const n = { id: String(Date.now()), author: name || 'Anonyme', text, ago: 'À l’instant', likes: 0 }
        setComments([n, ...comments])
        setName('')
        setEmail('')
        setText('')
        setMsg('Merci — commentaire ajouté')
      } else {
        const n = { id: String(Date.now()), author: name || 'Anonyme', text, ago: 'À l’instant', likes: 0 }
        const next = [n, ...comments]
        setComments(next)
        try {
          localStorage.setItem('comments_local', JSON.stringify(next))
        } catch (e) {}
        setMsg('Commentaire enregistré localement')
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

  return (
    <div className="rounded-2xl border border-white/6 bg-slate-950/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-white">Commentaires</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-300">{comments.length}</div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-3 mb-4">
        <input
          placeholder="Nom (optionnel)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full rounded-md bg-slate-900 border border-white/6 px-3 py-2 text-sm"
        />
        <input
          placeholder="Email (optionnel)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full rounded-md bg-slate-900 border border-white/6 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Votre commentaire"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          className="w-full rounded-md bg-slate-900 border border-white/6 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            {sending ? 'Envoi...' : 'Envoyer'}
          </button>
          <div className="text-sm text-slate-300">{msg}</div>
        </div>
      </form>

      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-400 flex items-center justify-center text-sm font-medium text-slate-900">
              {c.author[0]}
            </div>
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
