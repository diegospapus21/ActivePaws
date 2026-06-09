import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Plus, Mail, User } from 'lucide-react'

export default function MobileNav() {
  const location = useLocation()

  const links = [
    { to: '/',        icon: Home,  label: 'Inicio' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
    { to: '/admin',   icon: Plus,  label: 'Admin', highlight: true },
    { to: '/admin/pedidos', icon: Mail, label: 'Pedidos' },
    { to: '/login',   icon: User,  label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 flex md:hidden z-50">
      {links.map(({ to, icon: Icon, label, highlight }) => {
        const active = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${
              highlight
                ? 'text-paw-500'
                : active
                  ? 'text-paw-600'
                  : 'text-bark-400 hover:text-paw-500'
            }`}
          >
            <Icon size={highlight ? 22 : 18} strokeWidth={highlight ? 2.5 : 1.8} />
            <span className={highlight ? 'font-bold' : ''}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
