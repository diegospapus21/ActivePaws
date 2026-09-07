import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, User, LogOut, LayoutDashboard, Package } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import logo from '../assets/LogoDeActivePaws2.png'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Ropa para perros', to: '/ropa-perros' },
  { label: 'Ropa de gatos', to: '/ropa-gatos' },
  { label: 'Accesorios', to: '/accesorios' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isConfirmed } = useAuth()
  const { itemCount } = useCart()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
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
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* User menu con dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-amber-100/50 transition-all duration-200"
            >
              {user ? (
                <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center text-amber-700 font-bold text-sm hover:border-amber-600 transition-all duration-200 hover:scale-105">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-600">
                  <User size={18} />
                </div>
              )}
              {user && (
                <span className="hidden md:block text-sm font-medium text-amber-700 max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-lg border border-amber-200 py-2 min-w-[200px] z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-amber-100">
                      <p className="text-sm font-semibold text-amber-800">{user.name}</p>
                      <p className="text-xs text-amber-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                      {!isConfirmed && (
                        <p className="text-xs text-red-500 mt-1">⚠ Correo sin confirmar</p>
                      )}
                    </div>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <LayoutDashboard size={14} /> Panel Admin
                      </Link>
                    )}
                    {user.role !== 'admin' && (
                      <Link
                        to="/mis-pedidos"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Package size={14} /> Mis pedidos
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/registro"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-amber-600 font-semibold hover:bg-amber-50 transition-colors"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

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
          <div className="border-t border-amber-200 pt-3 mt-1">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-700 font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">{user.name}</p>
                    <p className="text-xs text-amber-600">{user.role === 'admin' ? 'Admin' : 'Cliente'}</p>
                  </div>
                </div>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold py-2 px-3 rounded-lg bg-amber-100 text-amber-700"
                  >
                    Panel Admin
                  </Link>
                ) : (
                  <Link
                    to="/mis-pedidos"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold py-2 px-3 rounded-lg bg-amber-100 text-amber-700"
                  >
                    Mis pedidos
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold py-2 px-3 rounded-lg text-red-500 hover:bg-red-50 text-left"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold py-2 px-3 rounded-lg text-amber-700 hover:bg-amber-100/50"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold py-2 px-3 rounded-lg text-amber-600 hover:bg-amber-100/50"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
