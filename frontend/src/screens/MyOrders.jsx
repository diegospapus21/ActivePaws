import { Link } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import StatusBadge from '../components/StatusBadge'
import { useMyOrders } from '../hooks/useMyOrders'

export default function MyOrders() {
  const { orders, loading } = useMyOrders()

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 w-full py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-paw-500 hover:text-paw-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <Package className="text-paw-500" size={22} />
          <h1 className="font-cursive text-3xl text-bark-800">Mis pedidos</h1>
        </div>

        {loading ? (
          <p className="text-bark-400 text-center py-16">Cargando tus pedidos...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-bark-400">
            <p className="text-lg mb-4">Todavía no tienes pedidos.</p>
            <Link to="/" className="btn-primary inline-block">Explorar productos</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-cream-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono font-semibold text-bark-700">#{order.orderNumber || order.id}</p>
                    <p className="text-xs text-bark-400">{order.date}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex flex-col gap-1 border-t border-cream-100 pt-2 mt-2">
                  {(order.items || []).map((it, i) => (
                    <div key={i} className="flex justify-between text-sm text-bark-600">
                      <span>{it.qty} × {it.name}</span>
                      <span>${(it.price * it.qty).toLocaleString()} {order.currency}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-cream-100 pt-2 mt-2">
                  <span className="text-sm font-semibold text-bark-700">Total</span>
                  <span className="font-bold text-paw-600">${Number(order.total).toLocaleString()} {order.currency}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
