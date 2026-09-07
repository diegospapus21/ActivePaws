import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import AdminNavbar from '../../components/AdminNavbar'
import { useDashboard } from '../../hooks/useDashboard'

import gestionProductosImg from '../../assets/gestiondeproductos.png'
import gestionPedidosImg from '../../assets/gestiondepedidos.png'
import gestionUsuariosImg from '../../assets/festiondeusuarios.png'

const STATUS_COLORS = {
  Pendiente: '#f0b429',
  Enviado:   '#3b82f6',
  Entregado: '#22c55e',
  Cancelado: '#ef4444',
}

export default function Dashboard() {
  const { data, loading } = useDashboard()

  const stats = data?.stats
  const topProducts = data?.topProducts || []
  const ordersByStatus = data?.ordersByStatus || []

  return (
    <div className="min-h-screen bg-cream-100 pb-16 md:pb-0">
      <AdminNavbar />

      {/* Welcome banner */}
      <div className="relative bg-cream-200 paw-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=200&h=160&fit=crop"
            alt="mascota"
            className="w-32 h-24 object-cover rounded-2xl hidden sm:block"
          />
          <div>
            <h1 className="font-cursive text-3xl text-bark-800 mb-1">¡Bienvenido de nuevo, Admin!</h1>
            <p className="text-sm text-bark-500">Aquí tiene un resumen de la actividad de la tienda:</p>
          </div>
        </div>
      </div>

      {loading || !stats ? (
        <p className="text-center text-bark-400 py-16">Cargando estadísticas...</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="max-w-7xl mx-auto px-4 mt-8 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { icon: Package, label: 'Productos activos', value: `${stats.activeProducts}/${stats.totalProducts}`, color: 'text-bark-600' },
                { icon: ShoppingBag, label: 'Pedidos totales', value: stats.totalOrders, extra: `${stats.pendingOrders} pendientes`, color: 'text-green-600' },
                { icon: Users, label: 'Usuarios activos', value: `${stats.activeUsers}/${stats.totalUsers}`, color: 'text-bark-600' },
                { icon: AlertTriangle, label: 'Stock bajo (≤10)', value: stats.lowStock, color: 'text-red-500' },
              ].map(({ icon: Icon, label, value, extra, color }) => (
                <div key={label} className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-paw-100 flex items-center justify-center text-paw-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-bark-400">{label}</p>
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    {extra && <p className="text-xs text-green-500">{extra}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart + Best sellers + Revenue */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Pedidos por estado (datos reales) */}
            <div className="lg:col-span-1 card">
              <h2 className="font-display font-semibold text-bark-700 mb-4">Pedidos por estado</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ordersByStatus}>
                  <XAxis dataKey="status" tick={{ fontSize: 10, fill: '#8c6448' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    formatter={v => [v, 'Pedidos']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {ordersByStatus.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#c9891a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Best sellers (datos reales) */}
            <div className="card">
              <h2 className="font-display font-semibold text-bark-700 mb-4">Productos más vendidos</h2>
              <div className="flex flex-col gap-3">
                {topProducts.length === 0 && <p className="text-xs text-bark-400">Sin datos todavía.</p>}
                {topProducts.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-cream-100" />
                    <span className="flex-1 text-sm text-bark-600 font-medium">{p.name}</span>
                    <span className="text-xs text-bark-400 font-semibold">{p.sold} ventas</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div className="card flex flex-col items-center justify-center gap-3">
              <h2 className="font-display font-semibold text-bark-700 self-start">Ingresos totales</h2>
              <div className="w-28 h-28 rounded-full border-[10px] border-paw-400 flex items-center justify-center relative">
                <div className="absolute inset-3 rounded-full border-[8px] border-cream-300" />
                <div className="text-center z-10">
                  <p className="text-lg font-bold text-bark-800">${stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-bark-400">MXN</p>
                </div>
              </div>
              <p className="text-xs text-bark-400 text-center">
                Calculado a partir de todos los pedidos no cancelados.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Gestión cards */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/productos" className="card flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div className="w-9 h-9 rounded-xl bg-paw-100 flex items-center justify-center overflow-hidden group-hover:bg-paw-200 transition-colors">
            <img src={gestionProductosImg} alt="Gestión de Productos" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-semibold text-bark-700 group-hover:text-paw-700 transition-colors">Gestión de Productos</span>
        </Link>

        <Link to="/admin/pedidos" className="card flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div className="w-9 h-9 rounded-xl bg-paw-100 flex items-center justify-center overflow-hidden group-hover:bg-paw-200 transition-colors">
            <img src={gestionPedidosImg} alt="Gestión de Pedidos" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-semibold text-bark-700 group-hover:text-paw-700 transition-colors">Gestión de Pedidos</span>
        </Link>

        <Link to="/admin/usuarios" className="card flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div className="w-9 h-9 rounded-xl bg-paw-100 flex items-center justify-center overflow-hidden group-hover:bg-paw-200 transition-colors">
            <img src={gestionUsuariosImg} alt="Gestión de Usuarios" className="w-6 h-6 object-contain" />
          </div>
          <span className="font-semibold text-bark-700 group-hover:text-paw-700 transition-colors">Gestión de Usuarios</span>
        </Link>
      </div>
    </div>
  )
}
