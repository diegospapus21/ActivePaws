import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import AdminNavbar from '../../components/AdminNavbar'
import StatusBadge from '../../components/StatusBadge'
// ✅ Custom Hook: toda la lógica CRUD centralizada aquí
import { useProducts } from '../../hooks/useProducts'

export default function ProductManagement() {
  const {
    filtered, paginated, totalPages,
    search, setSearch,
    modal, selected, form,
    page, setPage,
    menuOpen, setMenuOpen,
    openAdd, openEdit, openDelete, closeModal,
    handleSave, handleDelete,
    setField: f,
  } = useProducts()

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0" onClick={() => setMenuOpen(null)}>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8 paw-bg">
        <div className="text-center mb-8">
          <h1 className="font-cursive text-4xl text-bark-800 mb-2">Gestión de Productos</h1>
          <p className="text-bark-500 text-sm">Administra y gestiona los productos disponibles en la tienda.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Agregar Producto
          </button>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
            <input type="text" placeholder="Buscar producto..." className="input-field pl-9 py-2"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select className="input-field py-2 w-auto text-sm">
              <option>Ordenar por</option>
              <option>Nombre A–Z</option>
              <option>Precio mayor</option>
            </select>
            <select className="input-field py-2 w-auto text-sm">
              <option>Más recientes</option>
              <option>Más antiguos</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream-200">
                <th className="p-3 w-8"><input type="checkbox" className="accent-paw-500" /></th>
                <th className="p-3 text-left text-bark-500 font-semibold">Foto</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Producto</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Categoría</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Precio</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Stock</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Estado</th>
                <th className="p-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-bark-400">No se encontraron productos.</td></tr>
              )}
              {paginated.map((p) => (
                <tr key={p.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                  <td className="p-3"><input type="checkbox" className="accent-paw-500" /></td>
                  <td className="p-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-cream-100" />
                  </td>
                  <td className="p-3 font-medium text-bark-700">{p.name}</td>
                  <td className="p-3 text-bark-500 text-xs">{p.category}</td>
                  <td className="p-3 font-semibold text-bark-700">${Number(p.price).toLocaleString()} {p.currency}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-24 h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock > 50 ? 'bg-green-400' : p.stock > 20 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min((p.stock / 150) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-bark-400">{p.stock} uds.</span>
                    </div>
                  </td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3 relative">
                    <button
                      onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id) }}
                      className="p-1 text-bark-400 hover:text-bark-700 transition-colors rounded-lg hover:bg-cream-100"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === p.id && (
                      <div onClick={e => e.stopPropagation()} className="absolute right-8 top-2 bg-white rounded-xl shadow-lg border border-cream-200 z-20 py-1 min-w-[120px]">
                        <button onClick={() => openEdit(p)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-bark-700 hover:bg-cream-50">
                          <Pencil size={13} /> Editar
                        </button>
                        <button onClick={() => openDelete(p)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                          <Trash2 size={13} /> Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-cream-200 flex-wrap gap-2">
            <span className="text-xs text-bark-400">{filtered.length} productos</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="p-1.5 rounded hover:bg-cream-100 disabled:opacity-30 text-bark-500">
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${n === page ? 'bg-paw-500 text-white' : 'text-bark-500 hover:bg-cream-100'}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-bark-800">
                {modal === 'add' ? 'Agregar Producto' : 'Editar Producto'}
              </h2>
              <button onClick={closeModal} className="p-1 text-bark-400 hover:text-bark-700"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Nombre del producto *</label>
                <input className="input-field" placeholder="Ej. Suéter Azul" value={form.name} onChange={f('name')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Categoría *</label>
                <select className="input-field" value={form.category} onChange={f('category')}>
                  <option>Ropa para Perros</option>
                  <option>Ropa para Gatos</option>
                  <option>Accesorios</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Estado</label>
                <select className="input-field" value={form.status} onChange={f('status')}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Precio *</label>
                <input type="number" className="input-field" placeholder="0" value={form.price} onChange={f('price')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Moneda</label>
                <select className="input-field" value={form.currency} onChange={f('currency')}>
                  <option>MXN</option>
                  <option>USD</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Stock inicial *</label>
                <input type="number" className="input-field" placeholder="0" value={form.stock} onChange={f('stock')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-bark-600 mb-1 block">URL de imagen</label>
                <input className="input-field" placeholder="https://..." value={form.image} onChange={f('image')} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-bark-600 mb-1 block">Descripción</label>
                <textarea className="input-field resize-none h-20" placeholder="Descripción del producto..."
                  value={form.description} onChange={f('description')} />
              </div>
            </div>

            {(!form.name.trim() || !form.price || !form.stock) && (
              <p className="text-xs text-red-400 mt-3">* Los campos marcados son obligatorios.</p>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleSave} className="btn-primary flex-1"
                disabled={!form.name.trim() || !form.price || !form.stock}>
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
                <h2 className="font-display text-lg font-semibold text-bark-800">Eliminar producto</h2>
                <p className="text-xs text-bark-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <p className="text-sm text-bark-600 mb-5 bg-cream-100 rounded-lg p-3">
              ¿Estás seguro que deseas eliminar <b>"{selected.name}"</b>?
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
