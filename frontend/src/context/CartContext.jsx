import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

// ─── Contexto del carrito de compras ──────────────────────────────────────────
// El carrito vive en localStorage (independiente del backend) para que
// cualquier visitante pueda armar su carrito sin necesidad de iniciar sesión.
// Al finalizar la compra (checkout) SÍ se exige sesión iniciada y correo
// confirmado, y el pedido se crea en el backend con validación de stock.

const CartContext = createContext(null)
const CART_KEY = 'activepaws_cart'

function readCart() {
  try {
    const saved = localStorage.getItem(CART_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart)
  const { isLogged, isConfirmed } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  }, [cart])

  // Mantener sincronizado entre pestañas / componentes legacy que aún
  // disparan el evento 'cartUpdated' manualmente.
  useEffect(() => {
    const sync = () => setCart(readCart())
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const addItem = useCallback((product, qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty }
        return updated
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.image,
        quantity: qty,
      }]
    })
    showToast?.(`"${product.name}" agregado al carrito.`, 'success')
  }, [showToast])

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id))
  const clearCart  = () => setCart([])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  /**
   * checkout
   * Requiere sesión iniciada y correo confirmado. Envía el carrito al backend,
   * que valida stock y crea el pedido de forma atómica.
   */
  const checkout = async (shipping) => {
    if (!isLogged) {
      return { ok: false, reason: 'auth', message: 'Debes iniciar sesión para finalizar tu compra.' }
    }
    if (!isConfirmed) {
      return { ok: false, reason: 'confirm', message: 'Debes confirmar tu correo electrónico antes de comprar.' }
    }
    if (cart.length === 0) {
      return { ok: false, reason: 'empty', message: 'Tu carrito está vacío.' }
    }

    try {
      const items = cart.map(item => ({ productId: item.id, qty: item.quantity }))
      const res = await api.post('/orders/checkout', { items, shipping })
      clearCart()
      return { ok: true, order: res.order, message: res.message }
    } catch (err) {
      return { ok: false, reason: 'server', message: err.message || 'No se pudo completar la compra.' }
    }
  }

  return (
    <CartContext.Provider value={{
      cart, total, itemCount,
      addItem, updateQuantity, removeItem, clearCart, checkout,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
