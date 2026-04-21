import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut } from 'lucide-react'

const adminLinks = [
  { label: 'Inicio',        to: '/',                    icon: null },
  { label: 'Ropa para perros', to: '/ropa-perros',      icon: null },
  { label: 'Ropa de gatos', to: '/ropa-gatos',          icon: null },
  { label: 'Accesorios',    to: '/accesorios',           icon: null },
]

export default function AdminNavbar() {
  const location = useLocation()

  return (
    <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-paw-100 border-2 border-paw-400 flex items-center justify-center text-paw-600 font-bold text-xs">
            AP
          </div>
          <span className="font-cursive text-lg text-bark-700 hidden sm:block">ActivePaws</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {adminLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm font-semibold text-bark-600 hover:text-paw-600 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-bark-500 hidden sm:block">¡Hola, Admin!</span>
          <div className="w-8 h-8 rounded-full bg-paw-200 flex items-center justify-center text-paw-700 font-bold text-xs overflow-hidden">
            <img src="https://i.pravatar.cc/32?img=3" alt="admin" className="w-full h-full object-cover" />
          </div>
          <Link to="/login" className="p-1.5 text-bark-400 hover:text-red-500 transition-colors">
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </header>
  )
}
