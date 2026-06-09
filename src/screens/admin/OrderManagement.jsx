import { Search, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminNavbar from '../../components/AdminNavbar'
import StatusBadge from '../../components/StatusBadge'
//   Custom Hook: toda la lógica CRUD centralizada aquí
import { useOrders } from '../../hooks/useOrders'

const AVATARS = [
  'https://i.pravatar.cc/32?img=1', 'https://i.pravatar.cc/32?img=5',
  'https://i.pravatar.cc/32?img=8', 'https://i.pravatar.cc/32?img=9',
  'https://i.pravatar.cc/32?img=11','https://i.pravatar.cc/32?img=15',
]

export default function OrderManagement() {
  const {
    orders, filtered, paginated, totalPages,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    STATUS_OPTIONS,
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField: f,
  } = useOrders()

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-4 py-8 paw-bg">
        <div className="text-center mb-8">
          <h1 className="font-cursive text-4xl text-bark-800 mb-2">Gestión de Pedidos</h1>
          <p className="text-bark-500 text-sm">Administra, revisa y controla el estado de los pedidos realizados por los clientes.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Agregar pedido
          </button>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
            <input type="text" placeholder="Buscar pedidos..." className="input-field pl-9 py-2"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <select className="input-field py-2 w-auto text-sm ml-auto">
            <option>Ordenar por</option>
            <option>Más recientes</option>
            <option>Total mayor</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="p-3 w-8"><input type="checkbox" className="accent-paw-500" /></th>
                <th className="p-3 text-left text-bark-500 font-semibold">ID pedido</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Cliente</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Total</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Estado</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Fecha</th>
                <th className="p-3 w-20 text-bark-500 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-bark-400">No se encontraron pedidos.</td></tr>
              )}
              {paginated.map((o, i) => (
                <tr key={`${o.id}-${i}`} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="p-3"><input type="checkbox" className="accent-paw-500" /></td>
                  <td className="p-3 font-mono font-semibold text-bark-700">{o.id || o.orderNumber}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={AVATARS[i % AVATARS.length]} alt={o.client}
                        className="w-7 h-7 rounded-full object-cover bg-cream-200" />
                      <span className="text-bark-700 font-medium">{o.client}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-bark-700">${Number(o.total).toFixed(2)} {o.currency}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 text-bark-500">{o.date}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(o)}
                        className="p-1.5 rounded-lg text-bark-400 hover:text-paw-600 hover:bg-paw-50 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => openDelete(o)}
                        className="p-1.5 rounded-lg text-bark-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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
            <span className="text-xs text-bark-400">{filtered.length} pedidos</span>
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

      {/* ── ADD / EDIT MODAL ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-bark-800">
                {modal === 'add' ? 'Nuevo Pedido' : 'Editar Pedido'}
              </h2>
              <button onClick={closeModal} className="p-1 text-bark-400 hover:text-bark-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-bark-600 mb-1 block">ID Pedido</label>
                  <input className="input-field" value={form.orderNumber} onChange={f('orderNumber')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-bark-600 mb-1 block">Fecha</label>
                  <input className="input-field" placeholder="DD/MM/AAAA" value={form.date} onChange={f('date')} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Nombre del cliente *</label>
                <input className="input-field" placeholder="Nombre completo" value={form.client} onChange={f('client')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-bark-600 mb-1 block">Total *</label>
                  <input type="number" className="input-field" placeholder="0.00" value={form.total} onChange={f('total')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-bark-600 mb-1 block">Moneda</label>
                  <select className="input-field" value={form.currency} onChange={f('currency')}>
                    <option>USD</option>
                    <option>MXN</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Estado</label>
                <select className="input-field" value={form.status} onChange={f('status')}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleSave} className="btn-primary flex-1"
                disabled={!form.client.trim() || !form.total}>
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
                <h2 className="font-display text-lg font-semibold text-bark-800">Eliminar pedido</h2>
                <p className="text-xs text-bark-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <p className="text-sm text-bark-600 mb-5 bg-cream-100 rounded-lg p-3">
              ¿Eliminar el pedido <b>#{selected.id}</b> de <b>{selected.client}</b>?
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
