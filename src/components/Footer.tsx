import { googleFormUrl } from '../data'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 py-6 sm:py-8">
      <div className="container flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:gap-2">
          <p className="text-xs sm:text-sm text-slate-400">
            Baol Digital Show — édition 2024.
          </p>
          <p className="text-xs text-slate-500">
            Site conçu par{' '}
            <a
              href="http://absalon-technologies.online/"
              target="_blank"
              rel="noreferrer"
              className="text-brand-300 hover:text-brand-200 transition-colors"
            >
              Absalon Technologies
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300">
          <a href="/programme" className="hover:text-brand-300 transition-colors">Programme</a>
          <a href={googleFormUrl} target="_blank" rel="noreferrer" className="hover:text-brand-300 transition-colors">
            Google Forms
          </a>
          <a href="mailto:marketingsolutionscenter.msc@gmail.com" className="hover:text-brand-300 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
