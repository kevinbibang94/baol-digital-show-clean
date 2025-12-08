import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

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

    // Rafraîchir automatiquement "ago" toutes les 60 secondes
    const interval = setInterval(() => {
      setComments(prev =>
        prev.map(c => ({
          ...c,
          ago: c.created_at ? formatAgo(c.created_at) : c.ago
        }))
      )
    }, 60000)

    // 🔴 Realtime listener Supabase
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
            // Afficher un toast
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

  // Fonction utilitaire pour calculer "il y a X temps"
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
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
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

    // 🔍 Vérification des variables d’environnement
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ text, author: name || 'Anonyme', email, likes: 0 }])
        .select()

      if (error) {
        console.error('Insert error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        setMsg('Erreur d’envoi — réessayez')
      } else {
        setText('')
        setName('')
        setEmail('')
        setMsg('Merci — commentaire ajouté')
      }
    } catch (e) {
      console.error('Insert exception:', e)
      setMsg('Erreur d’envoi — réessayez')
    }


    if (!error) {
      setText('')
      setName('')
      setEmail('')
      setMsg('Merci — commentaire ajouté')
    } else {
      setMsg('Erreur d’envoi — réessayez')
    }

    setSending(false)
  }

  async function likeComment(id: string, currentLikes: number) {
    const { error } = await supabase
      .from('comments')
      .update({ likes: currentLikes + 1 })
      .eq('id', id)

    if (!error) {
      setComments(prev =>
        prev.map(c =>
          c.id === id ? { ...c, likes: (c.likes ?? 0) + 1 } : c
        )
      )
    }
  }

  return (
    <div className="rounded-2xl border border-white/6 bg-slate-950/30 p-4 relative">
      {/* Toast notification */}
      {toast && (
        <div className="absolute top-2 right-2 bg-brand-500 text-slate-900 px-4 py-2 rounded-md shadow-lg text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}

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
              {c.email && (
                <div className="text-xs italic text-slate-400">
                  <a href={`mailto:${c.email}`} className="hover:underline">
                    {c.email}
                  </a>
                </div>
              )}
              <div className="text-sm text-slate-300 mt-1">{c.text}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                {c.likes ?? 0} likes
                <button
                  onClick={() => likeComment(c.id, c.likes ?? 0)}
                  className="text-brand-400 hover:text-brand-300 ml-2"
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
