import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import logo from '../assets/LogoDeActivePaws2.png'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Ropa para perros', to: '/ropa-perros' },
  { label: 'Ropa de gatos', to: '/ropa-gatos' },
  { label: 'Accesorios', to: '/accesorios' },
]

export default function AdminNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-[#EFE4D2] border-b border-amber-200 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
        {/* Logo con imagen y texto */}
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
            <span className="text-xs text-amber-600/70 hidden sm:block">Panel Admin</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {adminLinks.map(link => (
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

        {/* Admin actions */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-amber-700 font-medium hidden sm:block">¡Hola, Admin!</span>
          
          <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center overflow-hidden hover:scale-105 transition-all duration-200">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
              alt="admin" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-amber-600 hover:text-red-500 hover:bg-amber-100/50 rounded-lg transition-all duration-200"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}