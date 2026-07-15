import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Payment() {
  const navigate = useNavigate()
  const { cart, total, checkout } = useCart()
  const { isLogged, isConfirmed } = useAuth()
  const { showToast } = useToast()
  const [method, setMethod] = useState('visa')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    cardNumber: '',
    expMonth: '01',
    expYear: '2026',
    cvv: '',
  })

  const handlePay = async () => {
    if (!isLogged || !isConfirmed) {
      showToast('Debes iniciar sesión y confirmar tu correo para comprar.', 'error')
      navigate('/carrito')
      return
    }
    if (cart.length === 0) {
      showToast('No hay productos en el carrito.', 'error')
      navigate('/carrito')
      return
    }
    if (!form.cardNumber || form.cardNumber.replace(/\s/g, '').length < 10) {
      showToast('Ingresa un número de tarjeta válido.', 'error')
      return
    }
    if (!form.cvv || form.cvv.length < 3) {
      showToast('Ingresa el código de seguridad (CVV).', 'error')
      return
    }

    setSubmitting(true)
    const result = await checkout({ method })
    setSubmitting(false)

    if (!result.ok) {
      showToast(result.message, 'error')
      return
    }

    showToast(`✅ ¡Pago realizado! Pedido #${result.order.orderNumber || result.order.id}`, 'success')
    navigate('/mis-pedidos')
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col pb-16 md:pb-0">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 w-full py-8 text-center">
          <h1 className="font-cursive text-3xl text-bark-800 mb-8">Método de Pago</h1>
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-8">
            <p className="text-bark-600 mb-4">No hay productos en tu carrito</p>
            <Link to="/" className="btn-primary inline-block">Ir a la tienda</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 w-full py-8">
        <h1 className="font-cursive text-3xl text-bark-800 mb-8 text-center">Método de Pago</h1>

        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold text-bark-700 mb-4 border-b border-cream-200 pb-2">
                Forma de Pago
              </h2>
              <div className="flex flex-col gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="payment" checked readOnly className="accent-paw-500" />
                  <span className="text-sm font-medium text-bark-700">Pago con tarjeta</span>
                </label>

                <div className="flex flex-wrap gap-3 pl-5">
                  {[
                    { id: 'visa', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', alt: 'VISA' },
                    { id: 'mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', alt: 'Mastercard' },
                    { id: 'paypal', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', alt: 'PayPal' },
                  ].map(card => (
                    <button
                      key={card.id}
                      onClick={() => setMethod(card.id)}
                      className={`w-20 h-10 border-2 rounded-lg flex items-center justify-center p-2 transition-all ${
                        method === card.id ? 'border-paw-400 bg-paw-50' : 'border-cream-200 hover:border-cream-300'
                      }`}
                    >
                      <img src={card.src} alt={card.alt} className="h-5 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Link to="/carrito" className="btn-secondary w-full inline-block text-center">
                  ← Volver al carrito
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-bark-700 mb-4 border-b border-cream-200 pb-2">
                Datos del Pago
              </h2>
              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-bark-500 mb-1 block">Total a pagar:</label>
                    <input
                      type="text"
                      value={`$${total.toLocaleString()} MXN`}
                      readOnly
                      className="input-field bg-green-50 text-green-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-bark-500 mb-1 block">Productos:</label>
                    <input
                      type="text"
                      value={`${cart.reduce((sum, i) => sum + i.quantity, 0)} unidades`}
                      readOnly
                      className="input-field bg-cream-100 text-bark-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-bark-500 mb-1 block">Número de Tarjeta:</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="input-field"
                    value={form.cardNumber}
                    onChange={e => setForm({ ...form, cardNumber: e.target.value })}
                    maxLength="19"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-bark-500 mb-1 block">Fecha expiración:</label>
                    <div className="flex gap-2">
                      <select
                        className="input-field"
                        value={form.expMonth}
                        onChange={e => setForm({ ...form, expMonth: e.target.value })}
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select
                        className="input-field"
                        value={form.expYear}
                        onChange={e => setForm({ ...form, expYear: e.target.value })}
                      >
                        {[2026, 2027, 2028, 2029, 2030].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-bark-500 mb-1 block">CVV:</label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      className="input-field"
                      value={form.cvv}
                      onChange={e => setForm({ ...form, cvv: e.target.value })}
                    />
                  </div>
                </div>

                <button onClick={handlePay} disabled={submitting} className="btn-primary w-full py-3 text-base mt-2 disabled:opacity-60">
                  {submitting ? 'Procesando...' : `Pagar $${total.toLocaleString()} MXN`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
