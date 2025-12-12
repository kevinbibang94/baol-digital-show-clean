// src/pages/Contact.tsx
import { googleFormUrl } from "../data"
import { useState } from "react"

function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formspreeEndpoint = (import.meta as any)?.env?.VITE_FORMSPREE_ENDPOINT?.trim()

    if (formspreeEndpoint) {
      setSubmitting(true)
      try {
        const payload = { name, email, subject, message }
        const res = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          setSent(true)
          setName("")
          setEmail("")
          setSubject("")
          setMessage("")
        } else {
          const text = await res.text().catch(() => "")
          setError(`Erreur d'envoi (${res.status}) ${text}`)
        }
      } catch {
        setError("Erreur réseau — veuillez réessayer.")
      } finally {
        setSubmitting(false)
      }
      return
    }

    // Fallback mailto si pas d’endpoint Formspree
    const body = `Nom: ${name}\r\nEmail: ${email}\r\n\r\n${message}`
    const mailto = `mailto:marketingsolutionscenter.msc@gmail.com?subject=${encodeURIComponent(
      subject || "Contact - Baol Digital Show"
    )}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 sm:space-y-4 glass rounded-2xl p-4 sm:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label htmlFor="name" className="block">
          <span className="text-xs text-slate-300">Nom</span>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/3 border border-white/5 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
            placeholder="Votre nom"
          />
        </label>
        <label htmlFor="email" className="block">
          <span className="text-xs text-slate-300">Email</span>
          <input
            id="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/3 border border-white/5 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
            placeholder="you@email.com"
          />
        </label>
      </div>

      <label htmlFor="subject" className="block">
        <span className="text-xs text-slate-300">Objet</span>
        <input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-lg bg-white/3 border border-white/5 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
          placeholder="Sujet de votre message"
        />
      </label>

      <label htmlFor="message" className="block">
        <span className="text-xs text-slate-300">Message</span>
        <textarea
          id="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-lg bg-white/3 border border-white/5 px-3 py-2 text-sm text-slate-100 min-h-[100px] sm:min-h-[140px] focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition"
          placeholder="Écrivez votre message ici"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center disabled:opacity-60 rounded-xl bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm font-semibold transition"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Envoi…
            </span>
          ) : (
            "Envoyer"
          )}
        </button>
      </div>

      {sent && (
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-emerald-400"
        >
          ✅ Message envoyé avec succès.
        </p>
      )}

      {error && (
        <p
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-rose-400"
        >
          ⚠️ {error}
        </p>
      )}
    </form>
  )
}
export default function ContactPage() {
  return (
    <main>
      <section className="border-b border-white/5 bg-slate-900/30 py-10 sm:py-12 lg:py-16">
        <div className="container grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
          
          {/* Colonne gauche : infos + formulaire */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-300">
              Contact
            </p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl">
              On reste en contact
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-slate-300">
              Besoin d'informations sur les billets, les partenariats ou les
              ateliers privés ? Écrivez-nous ou passez par WhatsApp.
            </p>

            {/* Liens directs */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              <a
                className="glass flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition hover:border-brand-400/60 gap-2"
                href="mailto:marketingsolutionscenter.msc@gmail.com?subject=Baol%20Digital%20Show"
              >
                <span className="text-slate-100 break-all">
                  marketingsolutionscenter.msc@gmail.com
                </span>
                <span className="text-brand-300">Email</span>
              </a>
              <a
                className="glass flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition hover:border-brand-400/60 gap-2"
                href="https://wa.me/221778773411"
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-slate-100">+221 77 877 34 11</span>
                <span className="text-brand-300">WhatsApp</span>
              </a>
              <a
                className="glass flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition hover:border-brand-400/60 sm:col-span-2 gap-2"
                href={googleFormUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="text-slate-100">
                  Formulaire Google (inscription)
                </span>
                <span className="text-brand-300">Ouvrir</span>
              </a>
            </div>

            {/* Formulaire */}
            <div className="mt-6 sm:mt-8">
              <ContactForm />
            </div>

            {/* Horaires */}
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4 text-xs sm:text-sm text-slate-300">
              Horaires : 09:00 - 18:30 • Centre Baol Digital, Dakar
            </div>
          </div>
          {/* Colonne droite : carte Google Maps */}
          <div className="glass overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 h-48 sm:h-64 lg:h-[420px]">
            <iframe
              title="Google Maps - Baol Digital"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.0016682185466!2d-17.47311852360775!3d14.693700876324248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xee8b591cf5d8c315%3A0x8d7854b3dfaf45f7!2sDakar!5e0!3m2!1sen!2ssn!4v1700000000000!5m2!1sen!2ssn"
              allowFullScreen
              loading="lazy"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
