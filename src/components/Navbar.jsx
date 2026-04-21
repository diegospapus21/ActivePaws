import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ isAdmin = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Ropa para perros', to: '/ropa-perros' },
    { label: 'Ropa de gatos', to: '/ropa-gatos' },
    { label: 'Accesorios', to: '/accesorios' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-paw-100 border-2 border-paw-400 flex items-center justify-center text-paw-600 font-bold text-sm">
            AP
          </div>
          <span className="font-cursive text-xl text-bark-700 hidden sm:block">ActivePaws</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold transition-colors ${
                isActive(link.to) ? 'text-paw-600 underline underline-offset-4' : 'text-bark-600 hover:text-paw-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-bark-500 hover:text-paw-600 transition-colors">
            <Search size={18} />
          </button>
          <Link to="/carrito" className="p-2 text-bark-500 hover:text-paw-600 transition-colors relative">
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-paw-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </Link>
          <Link to="/login" className="p-2 text-bark-500 hover:text-paw-600 transition-colors">
            <User size={18} />
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hidden md:block btn-primary text-xs py-1.5 px-3">
              Admin
            </Link>
          )}
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-bark-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 px-4 py-3 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold py-1 ${
                isActive(link.to) ? 'text-paw-600' : 'text-bark-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
