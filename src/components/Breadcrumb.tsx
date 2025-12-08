import { useLocation, Link } from 'react-router-dom'

export default function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  const breadcrumbLabels: { [key: string]: string } = {
    programme: 'Programme',
    intervenants: 'Intervenants',
    contact: 'Contact',
  }

  if (pathnames.length === 0) return null

  return (
    <nav className="bg-slate-950/50 border-b border-white/5 py-3 sm:py-4">
      <div className="container">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link to="/" className="hover:text-brand-300 transition-colors">
            Accueil
          </Link>
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
            const label = breadcrumbLabels[pathname] || pathname
            const isLast = index === pathnames.length - 1

            return (
              <div key={routeTo} className="flex items-center gap-2">
                <span>/</span>
                {isLast ? (
                  <span className="text-slate-200 font-medium">{label}</span>
                ) : (
                  <Link to={routeTo} className="hover:text-brand-300 transition-colors">
                    {label}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
