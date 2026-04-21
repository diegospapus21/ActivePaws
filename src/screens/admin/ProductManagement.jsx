import { useState } from 'react'
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminNavbar from '../../components/AdminNavbar'
import StatusBadge from '../../components/StatusBadge'
import { products as initialProducts } from '../../data/data'

export default function ProductManagement() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Más recientes')
  const [showModal, setShowModal] = useState(false)

  const filtered = initialProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8 paw-bg">
        <div className="text-center mb-8">
          <h1 className="font-cursive text-4xl text-bark-800 mb-2">Gestión de Productos</h1>
          <p className="text-bark-500 text-sm">Administra y gestiona los productos disponibles en la tienda.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Agregar Producto
          </button>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
            <input
              type="text"
              placeholder="Buscar producto......"
              className="input-field pl-9 py-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select
              className="input-field py-2 w-auto text-sm"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option>Ordenar por</option>
              <option>Nombre A–Z</option>
              <option>Precio mayor</option>
              <option>Precio menor</option>
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
                <th className="p-3 text-left text-bark-500 font-semibold">Inventario</th>
                <th className="p-3 text-left text-bark-500 font-semibold">Estado</th>
                <th className="p-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-cream-100 hover:bg-cream-50 transition-colors ${i % 2 === 0 ? '' : 'bg-cream-50/30'}`}>
                  <td className="p-3"><input type="checkbox" className="accent-paw-500" /></td>
                  <td className="p-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-cream-100" />
                  </td>
                  <td className="p-3 font-medium text-bark-700">{p.name}</td>
                  <td className="p-3 text-bark-500">{p.category}</td>
                  <td className="p-3 font-semibold text-bark-700">${p.price.toLocaleString()} {p.currency}</td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-32 h-2 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.stock > 50 ? 'bg-green-400' : p.stock > 20 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${Math.min((p.stock / 150) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-bark-400">{p.stock} / {p.sold + p.stock} disponibles</span>
                    </div>
                  </td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3">
                    <button className="p-1 text-bark-400 hover:text-bark-700 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-cream-200">
            <div className="flex items-center gap-1 text-bark-400">
              <button className="p-1 hover:text-bark-600"><ChevronLeft size={14} /></button>
              <button className="w-6 h-6 rounded bg-paw-500 text-white text-xs flex items-center justify-center">1</button>
              <button className="p-1 hover:text-bark-600"><ChevronRight size={14} /></button>
            </div>
            <span className="text-xs text-bark-400">Página 1 de 5</span>
            <select className="input-field py-1 text-xs w-auto">
              <option>15 Artículos por página</option>
              <option>30 Artículos por página</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-semibold text-bark-800 mb-4">Agregar Producto</h2>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Nombre del producto" className="input-field" />
              <select className="input-field">
                <option>Ropa para Perros</option>
                <option>Ropa para Gatos</option>
                <option>Accesorios</option>
              </select>
              <input type="number" placeholder="Precio (MXN)" className="input-field" />
              <input type="number" placeholder="Stock inicial" className="input-field" />
              <textarea placeholder="Descripción" className="input-field resize-none h-24" />
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
