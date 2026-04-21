import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { products } from '../data/data'

const initialCart = [
  { ...products[4], qty: 1 },
  { ...products[5], qty: 2 },
  { ...products[6], qty: 1 },
]

export default function Cart() {
  const [cart, setCart] = useState(initialCart)

  const update = (id, delta) =>
    setCart(c =>
      c
        .map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)
        .filter(item => item.qty > 0)
    )

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 w-full py-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-paw-500">🛒</span>
          <h1 className="font-cursive text-3xl text-bark-800">Carrito de compras</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 text-bark-400">
            <p className="text-lg mb-4">Tu carrito está vacío</p>
            <Link to="/" className="btn-primary">Explorar productos</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-cream-200 shadow-sm p-4 flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-display font-semibold text-bark-800">{item.name}</h3>
                    <button
                      onClick={() => update(item.id, -item.qty)}
                      className="text-bark-300 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-bark-400">Precio:</p>
                    <p className="text-paw-600 font-bold">${item.price.toLocaleString()}.00 {item.currency}</p>
                  </div>
                  <p className="text-xs text-bark-500 leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <button
                      onClick={() => update(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => update(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="ml-auto text-xs text-bark-400">🛒</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl border border-cream-200 p-4 flex items-center justify-between">
              <span className="font-semibold text-bark-700">Total:</span>
              <span className="text-lg font-bold text-paw-600">${total.toLocaleString()} MXN</span>
            </div>

            <Link to="/pago" className="btn-primary w-full text-center py-3 text-base">
              Ver Historial de Compra
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
