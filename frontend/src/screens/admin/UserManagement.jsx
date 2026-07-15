import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminNavbar from '../../components/AdminNavbar'
import MobileNav from '../../components/MobileNav'
import StatusBadge from '../../components/StatusBadge'
import { useUsers } from '../../hooks/useUsers'

export default function UserManagement() {
  const {
    loading, paginated, filtered, totalPages, users,
    activeCount, adminCount,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    sortBy, setSortBy,
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField,
  } = useUsers()

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-4 py-8 paw-bg">
        <div className="text-center mb-6">
          <h1 className="font-cursive text-4xl text-bark-800 mb-2">Gestión de Usuarios</h1>
          <p className="text-bark-500 text-sm">Administra y gestiona las cuentas disponibles</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total usuarios', value: users.length, color: 'text-bark-700' },
            { label: 'Activos',        value: activeCount,  color: 'text-green-600' },
            { label: 'Administradores',value: adminCount,   color: 'text-blue-600'  },
          ].map(stat => (
            <div key={stat.label} className="card text-center py-3">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-bark-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Agregar Usuario
          </button>
          <div className="relative flex-1 min-w-[180px] max-w-xs ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
            <input type="text" placeholder="Buscar usuario..." className="input-field pl-9 py-2"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <select className="input-field py-2 w-auto text-sm"
            value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Ordenar por</option>
            <option value="name">Nombre A–Z</option>
            <option value="role">Rol</option>
            <option value="status">Estado</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="p-3 text-left text-bark-500 font-semibold">Nombre</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Email</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Rol</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Estado</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Correo</th>
                <th className="p-3 w-20 text-bark-500 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="text-center py-10 text-bark-400">Cargando usuarios...</td></tr>
              )}
              {!loading && paginated.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-bark-400">No se encontraron usuarios.</td></tr>
              )}
              {!loading && paginated.map((u) => (
                <tr key={u.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-paw-100 flex items-center justify-center text-paw-700 font-bold text-xs">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-bark-700 font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-bark-500 text-xs">{u.email}</td>
                  <td className="p-3"><StatusBadge status={u.role} /></td>
                  <td className="p-3"><StatusBadge status={u.status} /></td>
                  <td className="p-3">
                    {u.emailConfirmed
                      ? <span className="text-xs text-green-600 font-semibold">Confirmado</span>
                      : <span className="text-xs text-red-500 font-semibold">Sin confirmar</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-bark-400 hover:text-paw-600 hover:bg-paw-50 transition-colors"
                        title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => openDelete(u)}
                        className="p-1.5 rounded-lg text-bark-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-cream-200 flex-wrap gap-2">
            <span className="text-xs text-bark-400">{filtered.length} usuarios</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="p-1.5 rounded hover:bg-cream-100 disabled:opacity-30 text-bark-500">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages || 1 }, (_, i) => i+1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${n === page ? 'bg-paw-500 text-white' : 'text-bark-500 hover:bg-cream-100'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages}
                className="p-1.5 rounded hover:bg-cream-100 disabled:opacity-30 text-bark-500">
                <ChevronRight size={14} />
              </button>
            </div>
            <span className="text-xs text-bark-400">Página {page} de {totalPages || 1}</span>
          </div>
        </div>
      </div>

      <MobileNav />

      {/* ── ADD / EDIT MODAL ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-bark-800">
                {modal === 'add' ? 'Agregar Usuario' : 'Editar Usuario'}
              </h2>
              <button onClick={closeModal} className="p-1 text-bark-400 hover:text-bark-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Nombre completo *</label>
                <input className="input-field" placeholder="Nombre Apellido" value={form.name} onChange={setField('name')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Correo electrónico *</label>
                <input type="email" className="input-field" placeholder="correo@ejemplo.com" value={form.email} onChange={setField('email')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Nombre de usuario</label>
                <input className="input-field" placeholder="usuario123" value={form.username} onChange={setField('username')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-bark-600 mb-1 block">Rol</label>
                  <select className="input-field" value={form.role} onChange={setField('role')}>
                    <option>Cliente</option>
                    <option>Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-bark-600 mb-1 block">Estado</label>
                  <select className="input-field" value={form.status} onChange={setField('status')}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">
                  {modal === 'add' ? 'Contraseña temporal' : 'Nueva contraseña (opcional)'}
                </label>
                <input type="password" className="input-field" placeholder="••••••••" value={form.password} onChange={setField('password')} />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleSave} className="btn-primary flex-1"
                disabled={!form.name.trim() || !form.email.trim()}>
                {modal === 'add' ? 'Agregar' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {modal === 'delete' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-bark-800">Eliminar usuario</h2>
                <p className="text-xs text-bark-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <p className="text-sm text-bark-600 mb-5 bg-cream-100 rounded-lg p-3">
              ¿Estás seguro que deseas eliminar la cuenta de <b>"{selected.name}"</b>?
            </p>
            <div className="flex gap-3">
              <button onClick={closeModal} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
