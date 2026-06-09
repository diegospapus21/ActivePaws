import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cartData = JSON.parse(savedCart)
      setCart(cartData)
      const totalAmount = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setTotal(totalAmount)
    }
  }

  const updateQuantity = (id, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        return { ...item, quantity: Math.max(1, newQuantity) }
      }
      return item
    })
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    const newTotal = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    const newTotal = newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
    setTotal(0)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleCheckout = () => {
    if (cart.length > 0) {
      navigate('/pago')
    }
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 w-full py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-paw-500 hover:text-paw-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-paw-500">🛒</span>
          <h1 className="font-cursive text-3xl text-bark-800">Carrito de compras</h1>
          {cart.length > 0 && (
            <button onClick={clearCart} className="ml-auto text-xs text-red-500 hover:text-red-600">
              Vaciar carrito
            </button>
          )}
        </div>


        {cart.length === 0 ? (
          <div className="text-center py-16 text-bark-400">
            <p className="text-lg mb-4">Tu carrito está vacío</p>
            <Link to="/" className="btn-primary inline-block">Explorar productos</Link>
          </div>
        ) : (
          <>
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
                        onClick={() => removeItem(item.id)}
                        className="text-bark-300 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-bark-400">Precio:</p>
                      <p className="text-paw-600 font-bold">${item.price.toLocaleString()}.00 {item.currency}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-auto">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="ml-auto text-xs font-semibold text-paw-600">
                        ${(item.price * item.quantity).toLocaleString()} MXN
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 p-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-bark-700">Subtotal:</span>
                <span className="text-bark-800">${total.toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-sm text-bark-500">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="border-t border-cream-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-bark-800 text-lg">Total:</span>
                <span className="text-xl font-bold text-paw-600">${total.toLocaleString()} MXN</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Link to="/" className="btn-secondary flex-1 text-center py-3 text-base">
                Seguir comprando
              </Link>
              <button onClick={handleCheckout} className="btn-primary flex-1 py-3 text-base">
                Proceder al pago...
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}