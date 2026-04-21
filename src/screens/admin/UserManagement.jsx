import { useState } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminNavbar from '../../components/AdminNavbar'
import MobileNav from '../../components/MobileNav'
import StatusBadge from '../../components/StatusBadge'
import { users as initialUsers } from '../../data/data'

const AVATARS = [
  'https://i.pravatar.cc/32?img=1',
  'https://i.pravatar.cc/32?img=5',
  'https://i.pravatar.cc/32?img=8',
  'https://i.pravatar.cc/32?img=9',
  'https://i.pravatar.cc/32?img=11',
  'https://i.pravatar.cc/32?img=13',
]

export default function UserManagement() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = initialUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-4 py-8 paw-bg">
        <div className="text-center mb-8">
          <h1 className="font-cursive text-4xl text-bark-800 mb-2">Gestión de Usuarios</h1>
          <p className="text-bark-500 text-sm">Administra y gestiona las cuentas disponibles</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Agregar Usuario
          </button>
          <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
            <input
              type="text"
              placeholder="Buscar Usuario..."
              className="input-field pl-9 py-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field py-2 w-auto text-sm">
            <option>Ordenar por</option>
            <option>Nombre A–Z</option>
            <option>Rol</option>
            <option>Estado</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="p-3 w-8"><input type="checkbox" className="accent-paw-500" /></th>
                <th className="p-3 text-left text-bark-500 font-semibold">Nombre</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Email</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Rol</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="p-3"><input type="checkbox" className="accent-paw-500" /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={AVATARS[i % AVATARS.length]}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover bg-cream-200"
                      />
                      <span className="text-bark-700 font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-bark-500">{u.email}</td>
                  <td className="p-3"><StatusBadge status={u.role} /></td>
                  <td className="p-3"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-cream-200 flex-wrap gap-2">
            <span className="text-xs text-bark-400 font-mono">001261</span>
            <div className="flex items-center gap-1 text-bark-400">
              <button className="p-1 hover:text-bark-600 disabled:opacity-30" disabled><ChevronLeft size={14} /></button>
              <button className="w-6 h-6 rounded bg-paw-500 text-white text-xs flex items-center justify-center">1</button>
              <button className="p-1 hover:text-bark-600"><ChevronRight size={14} /></button>
            </div>
            <span className="text-xs text-bark-400">Página 1 de 7</span>
            <select className="input-field py-1 text-xs w-auto">
              <option>15 Usuarios per página</option>
              <option>30 Usuarios per página</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-semibold text-bark-800 mb-4">Agregar Usuario</h2>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Nombre completo" className="input-field" />
              <input type="email" placeholder="Correo electrónico" className="input-field" />
              <select className="input-field">
                <option>Cliente</option>
                <option>Administrador</option>
              </select>
              <select className="input-field">
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={() => setShowModal(false)} className="btn-primary flex-1">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
