import { useState } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminNavbar from '../../components/AdminNavbar'
import StatusBadge from '../../components/StatusBadge'
import { orders as initialOrders } from '../../data/data'

const AVATARS = {
  LM: 'https://i.pravatar.cc/32?img=1',
  CR: 'https://i.pravatar.cc/32?img=5',
  JG: 'https://i.pravatar.cc/32?img=8',
  AT: 'https://i.pravatar.cc/32?img=9',
  SM: 'https://i.pravatar.cc/32?img=11',
  SA: 'https://i.pravatar.cc/32?img=15',
}

export default function OrderManagement() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = initialOrders.filter(o =>
    o.client.toLowerCase().includes(search.toLowerCase()) ||
    o.id.includes(search)
  )

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0">
      <AdminNavbar />

      <div className="max-w-5xl mx-auto px-4 py-8 paw-bg">
        <div className="text-center mb-8">
          <h1 className="font-cursive text-4xl text-bark-800 mb-2">Gestión de Pedidos</h1>
          <p className="text-bark-500 text-sm">
            Administra, revisa y controla el estado de los pedidos realizados por los clientes.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Agregar pedido
          </button>
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              className="input-field pl-9 py-2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field py-2 w-auto text-sm ml-auto">
            <option>Ordenar por</option>
            <option>Fecha más reciente</option>
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
                <th className="p-3 text-left text-bark-500 font-semibold">Fecha del pedido</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr
                  key={`${o.id}-${i}`}
                  className="border-b border-cream-100 hover:bg-cream-50 transition-colors"
                >
                  <td className="p-3"><input type="checkbox" className="accent-paw-500" /></td>
                  <td className="p-3 font-mono font-semibold text-bark-700">{o.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={AVATARS[o.avatar] || `https://i.pravatar.cc/32?img=${i + 2}`}
                        alt={o.client}
                        className="w-7 h-7 rounded-full object-cover bg-cream-200"
                      />
                      <span className="text-bark-700 font-medium">{o.client}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-bark-700">
                    ${o.total.toFixed(2)} {o.currency}
                  </td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 text-bark-500">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl font-semibold text-bark-800 mb-4">Agregar Pedido</h2>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="ID Pedido" className="input-field" />
              <input type="text" placeholder="Nombre del cliente" className="input-field" />
              <input type="number" placeholder="Total (USD)" className="input-field" />
              <select className="input-field">
                <option>Pendiente</option>
                <option>Enviado</option>
                <option>Entregado</option>
                <option>Cancelado</option>
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
