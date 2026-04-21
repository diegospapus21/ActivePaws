import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, Grid3x3, ClipboardList, UserCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import AdminNavbar from '../../components/AdminNavbar'
import { weeklySales, products, orders } from '../../data/data'

const BEST = [
  { name: 'Suéter Azul',     sales: 450, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=60&h=60&fit=crop' },
  { name: 'Vestido Amarillo', sales: 132, img: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=60&h=60&fit=crop' },
  { name: 'Suéter Beige',    sales: 110, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop' },
  { name: 'Abrigo Azul',     sales: 98,  img: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=60&h=60&fit=crop' },
]

export default function Dashboard() {
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
            <p className="text-sm text-bark-500">Aquí tiene un resumen de la actividad de hoy :</p>
          </div>
        </div>
      </div>

      {/* KPI cards - Separados del banner de arriba con más espacio */}
      {/* Cambié el -mt-4 por mt-8 para que haya más separación */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Package, label: 'Total de Productos', value: products.length, delta: '+15 hoy', color: 'text-bark-600' },
            { icon: ShoppingBag, label: 'Pedidos de Hoy', value: 23, delta: '+8 más que ayer', color: 'text-green-600' },
            { icon: Users, label: 'Nuevos Usuarios', value: 12, delta: '+4 hoy', color: 'text-bark-600' },
          ].map(({ icon: Icon, label, value, delta, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-paw-100 flex items-center justify-center text-paw-600">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xs text-bark-400">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-green-500">{delta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart + Best sellers + Revenue */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Chart */}
        <div className="lg:col-span-1 card">
          <h2 className="font-display font-semibold text-bark-700 mb-4">Ventas de la semana</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklySales}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8c6448' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                formatter={v => [`$${v.toLocaleString()}`, 'Ventas']}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#c9891a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#c9891a', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-200">
            <p className="text-sm font-semibold text-green-600">+ $1,700 USD esta semana</p>
            <div className="bg-paw-500 text-white text-xs font-bold px-4 py-2 rounded-lg">$35,459 USD</div>
          </div>
          <div className="text-center mt-2">
            <Link to="/admin" className="text-xs text-bark-400 underline hover:text-paw-600">Ventas Semanales</Link>
          </div>
        </div>

        {/* Best sellers */}
        <div className="card">
          <h2 className="font-display font-semibold text-bark-700 mb-4">Productos más vendidos</h2>
          <div className="flex flex-col gap-3">
            {BEST.map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-cream-100" />
                <span className="flex-1 text-sm text-bark-600 font-medium">{p.name}</span>
                <span className="text-xs text-bark-400 font-semibold">{p.sales} ventas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue donut */}
        <div className="card flex flex-col items-center justify-center gap-3">
          <h2 className="font-display font-semibold text-bark-700 self-start">Ingresos de Hoy</h2>
          <div className="w-28 h-28 rounded-full border-[10px] border-paw-400 flex items-center justify-center relative">
            <div className="absolute inset-3 rounded-full border-[8px] border-cream-300" />
            <div className="text-center z-10">
              <p className="text-lg font-bold text-bark-800">$8,120</p>
              <p className="text-xs text-bark-400">MXN</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-bark-400">Ingresos Locales $1,032,445</p>
            <p className="text-xl font-bold text-paw-600 mt-1">$1,032.4 USD</p>
          </div>
        </div>
      </div>

      {/* Gestión cards con nuevos iconos */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Gestión de Productos', to: '/admin/productos', icon: Grid3x3 },
          { label: 'Gestión de Pedidos',   to: '/admin/pedidos',   icon: ClipboardList },
          { label: 'Gestión de Usuarios',  to: '/admin/usuarios',  icon: UserCircle },
        ].map(({ label, to, icon: Icon }) => (
          <Link key={to} to={to} className="card flex items-center gap-3 hover:shadow-md transition-shadow group">
            <div className="w-9 h-9 rounded-xl bg-paw-100 flex items-center justify-center text-paw-600 group-hover:bg-paw-200 transition-colors">
              <Icon size={16} />
            </div>
            <span className="font-semibold text-bark-700 group-hover:text-paw-700 transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}