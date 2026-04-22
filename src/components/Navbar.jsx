import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import logo from '../assets/LogoDeActivePaws2.png'

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
    <header className="bg-[#EFE4D2] border-b border-amber-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo con tu imagen más grande y texto */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img 
            src={logo}
            alt="ActivePaws Logo"
            className="h-14 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
          />
          <div className="flex flex-col">
            <span className="font-cursive text-2xl text-amber-800 leading-tight">
              Active<span className="text-amber-600">Paws</span>
            </span>
            <span className="text-xs text-amber-600/70 hidden sm:block">Pet Fashion</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold transition-all duration-200 ${
                isActive(link.to) 
                  ? 'text-amber-700 border-b-2 border-amber-600 pb-1' 
                  : 'text-amber-700/70 hover:text-amber-600 hover:border-b-2 hover:border-amber-600/50 pb-1'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-amber-700 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200">
            <Search size={18} />
          </button>
          <Link to="/carrito" className="p-2 text-amber-700 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200 relative">
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
          </Link>
          
          {/* Foto de perfil del admin */}
          {isAdmin ? (
            <Link to="/admin" className="flex items-center gap-2 ml-2">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Admin profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-amber-500 hover:border-amber-600 transition-all duration-200 hover:scale-105"
              />
              <span className="hidden md:block text-sm font-medium text-amber-700">Admin</span>
            </Link>
          ) : (
            <Link to="/login" className="p-2 text-amber-700 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200">
              <User size={18} />
            </Link>
          )}
          
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-amber-700 hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#EFE4D2] border-t border-amber-200 px-4 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive(link.to) 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'text-amber-700/70 hover:bg-amber-100/50 hover:text-amber-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold py-2 px-3 rounded-lg bg-amber-100 text-amber-700"
            >
              Panel Admin
            </Link>
          )}
        </div>
      )}
    </header>
  )
}