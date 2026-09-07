import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../api/client'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

// ─── Contexto del carrito (móvil) ──────────────────────────────────────────────
// El carrito vive en AsyncStorage (local del dispositivo) para que el visitante
// pueda armarlo sin sesión. El checkout SÍ exige sesión + correo confirmado y
// crea el pedido real en el backend (valida stock y descuenta inventario).

const CartContext = createContext(null)
const CART_KEY = 'activepaws_cart'

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [hydrated, setHydrated] = useState(false)
  const { isLogged, isConfirmed } = useAuth()
  const { showToast } = useToast()

  // Cargar carrito guardado al iniciar
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_KEY)
        if (saved) setCart(JSON.parse(saved))
      } catch { /* noop */ }
      setHydrated(true)
    })()
  }, [])

  // Persistir cada cambio
  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(CART_KEY, JSON.stringify(cart)).catch(() => {})
  }, [cart, hydrated])

  const addItem = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty }
        return updated
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.image,
          stock: product.stock,
          quantity: qty,
        },
      ]
    })
    showToast(`"${product.name}" agregado al carrito.`, 'success')
  }, [showToast])

  const updateQuantity = useCallback((id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    )
  }, [])

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  /**
   * checkout — Requiere sesión y correo confirmado. Envía el carrito al backend.
   * @param {object} shipping datos de envío { name, address, city, phone }
   */
  const checkout = useCallback(async (shipping) => {
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
      const items = cart.map((item) => ({ productId: item.id, qty: item.quantity }))
      const res = await api.post('/orders/checkout', { items, shipping })
      clearCart()
      return { ok: true, order: res.order, message: res.message }
    } catch (err) {
      return { ok: false, reason: 'server', message: err.message || 'No se pudo completar la compra.' }
    }
  }, [cart, isLogged, isConfirmed, clearCart])

  const value = { cart, total, itemCount, addItem, updateQuantity, removeItem, clearCart, checkout }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
