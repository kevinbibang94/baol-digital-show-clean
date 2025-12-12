import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import "./CommentsPanel.css"

type Comment = {
  id: string
  author: string
  text: string
  email?: string
  ago: string
  likes?: number
  created_at?: string
}
export default function CommentsPanel() {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    fetchComments()

    const interval = setInterval(() => {
      setComments(prev =>
        prev.map(c => ({
          ...c,
          ago: c.created_at ? formatAgo(c.created_at) : c.ago
        }))
      )
    }, 60000)

    const channel = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        payload => {
          if (payload.eventType === 'INSERT') {
            const c: any = payload.new
            setComments(prev => [
              {
                id: c.id,
                author: c.author || 'Anonyme',
                text: c.text,
                email: c.email || '',
                created_at: c.created_at,
                ago: formatAgo(c.created_at),
                likes: c.likes ?? 0
              },
              ...prev
            ])
            setToast(`Nouveau commentaire de ${c.author || 'Anonyme'}`)
            setTimeout(() => setToast(null), 4000)
          }
          if (payload.eventType === 'UPDATE') {
            const c: any = payload.new
            setComments(prev =>
              prev.map(item =>
                item.id === c.id
                  ? {
                      ...item,
                      likes: c.likes ?? item.likes,
                      ago: formatAgo(c.created_at)
                    }
                  : item
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (msg) {
      const timeout = setTimeout(() => setMsg(null), 3000)
      return () => clearTimeout(timeout)
    }
  }, [msg])

  function formatAgo(dateString: string): string {
    const date = new Date(dateString)
    const diff = Date.now() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return `il y a ${seconds} sec`
    if (minutes < 60) return `il y a ${minutes} min`
    if (hours < 24) return `il y a ${hours} h`
    return `il y a ${days} j`
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('id, author, text, email, created_at, likes')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch error:', error)
      return
    }

    if (data) {
      const formatted = data.map((c: any) => ({
        id: c.id,
        author: c.author || 'Anonyme',
        text: c.text,
        email: c.email || '',
        created_at: c.created_at,
        ago: formatAgo(c.created_at),
        likes: c.likes ?? 0
      }))
      setComments(formatted)
    }
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) {
      setMsg('Le commentaire est vide')
      return
    }
    setSending(true)
    setMsg(null)

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ text, author: name || 'Anonyme', email, likes: 0 }])

      if (error) {
        console.error('Insert error:', error)
        setMsg('Erreur d’envoi — réessayez')
      } else {
        await fetchComments()
        setText('')
        setName('')
        setEmail('')
        setMsg('Merci — commentaire ajouté')
      }
    } catch (e) {
      console.error('Insert exception:', e)
      setMsg('Erreur d’envoi — réessayez')
    }

    setSending(false)
  }

  async function likeComment(id: string, currentLikes: number) {
    if (localStorage.getItem(`liked_${id}`)) {
      setToast("Vous avez déjà liké ce commentaire")
      setTimeout(() => setToast(null), 3000)
      return
    }

    const { error } = await supabase
      .from('comments')
      .update({ likes: currentLikes + 1 })
      .eq('id', id)

    if (error) {
      console.error('Like error:', error.message)
      setToast("Erreur lors du like")
      setTimeout(() => setToast(null), 3000)
      return
    }

    setComments(prev =>
      prev.map(c =>
        c.id === id ? { ...c, likes: (c.likes ?? 0) + 1 } : c
      )
    )

    localStorage.setItem(`liked_${id}`, 'true')

    setToast("Merci pour votre like !")
    setTimeout(() => setToast(null), 3000)
  }
  return (
    <div className="comments-panel rounded-2xl border border-white/6 bg-slate-950/30 p-4 relative">
      {toast && (
        <div className="toast absolute top-2 right-2 bg-brand-500 text-slate-900 px-4 py-2 rounded-md shadow-lg text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-white">Commentaires</div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-300">{comments.length}</div>
        </div>
      </div>
      <form onSubmit={submit} className="comments-form space-y-3 mb-4 animate-fadeIn">
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
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {comments.map(c => (
          <div key={c.id} className="comment-item flex items-start gap-3">
            <div className="comment-avatar">
              {c.author[0]}
            </div>
            <div className="comment-content flex-1">
              <div className="flex items-center justify-between">
                <div className="comment-author">{c.author}</div>
                <div className="comment-meta">{c.ago}</div>
              </div>
              {c.email && (
                <div className="text-xs italic text-slate-400">
                  <a href={`mailto:${c.email}`} className="hover:underline">
                    {c.email}
                  </a>
                </div>
              )}
              <div className="comment-text mt-1">{c.text}</div>
              <div className="comment-actions mt-2 flex items-center gap-2 text-xs text-slate-400">
                {c.likes === 1 ? '1 like' : `${c.likes ?? 0} likes`}
                <button
                  onClick={() => likeComment(c.id, c.likes ?? 0)}
                  className="text-brand-400 hover:text-brand-300 ml-2 transition-transform duration-200 active:scale-125"
                >
                  👍 J’aime
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
