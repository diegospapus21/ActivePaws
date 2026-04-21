import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Payment() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('visa')
  const [form, setForm] = useState({
    cardNumber: '',
    expMonth: '01',
    expYear: '2026',
    cvv: '',
  })

  const handlePay = () => navigate('/')

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 w-full py-8">
        <h1 className="font-cursive text-3xl text-bark-800 mb-8 text-center">Metodo de Pago</h1>

        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: payment methods */}
            <div>
              <h2 className="font-semibold text-bark-700 mb-4 border-b border-cream-200 pb-2">
                Forma de Pago
              </h2>
              <div className="flex flex-col gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked
                    readOnly
                    className="accent-paw-500"
                  />
                  <span className="text-sm font-medium text-bark-700">Pago con tarjeta</span>
                </label>

                <div className="flex flex-col gap-3 pl-5">
                  {[
                    { id: 'visa', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', alt: 'VISA' },
                    { id: 'paypal', src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', alt: 'PayPal' },
                    { id: 'mastercard', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', alt: 'Mastercard' },
                  ].map(card => (
                    <button
                      key={card.id}
                      onClick={() => setMethod(card.id)}
                      className={`w-24 h-12 border-2 rounded-lg flex items-center justify-center p-2 transition-all ${
                        method === card.id ? 'border-paw-400 bg-paw-50' : 'border-cream-200 hover:border-cream-300'
                      }`}
                    >
                      <img src={card.src} alt={card.alt} className="h-6 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/carrito')}
                  className="w-full btn-secondary"
                >
                  Cancelar
                </button>
                <p className="text-center text-xs text-bark-400 mt-1">Volver al comercio</p>
              </div>
            </div>

            {/* Right: card details */}
            <div>
              <h2 className="font-semibold text-bark-700 mb-4 border-b border-cream-200 pb-2">
                Datos del Pago
              </h2>
              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-bark-500 mb-1 block">Numero de operacion:</label>
                    <input
                      type="text"
                      value="1235"
                      readOnly
                      className="input-field bg-cream-100 text-bark-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-bark-500 mb-1 block">Importe:</label>
                    <input
                      type="text"
                      value="$3.00"
                      readOnly
                      className="input-field bg-cream-100 text-bark-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-bark-500 mb-1 block">Tarjeta:</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="input-field"
                    value={form.cardNumber}
                    onChange={e => setForm({ ...form, cardNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs text-bark-500 mb-1 block">Fecha de caducidad (MM/AAA):</label>
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

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-bark-500 mb-1 block">Codigo de Seguridad:</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      className="input-field"
                      value={form.cvv}
                      onChange={e => setForm({ ...form, cvv: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handlePay}
                    className="btn-primary px-8"
                  >
                    Pagar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
