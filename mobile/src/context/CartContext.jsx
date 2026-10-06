import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../api/client'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

// ─── Contexto del carrito (móvil) ──────────────────────────────────────────────
// El carrito vive en AsyncStorage (local del dispositivo) para que el visitante
// pueda armarlo sin sesión. El checkout SÍ exige sesión + correo confirmado y
// crea el pedido real en el backend (valida stock y descuenta inventario).
//
// Validaciones de stock en la app:
//  • Nunca se agregan más unidades de las que hay en stock.
//  • La cantidad mínima es 1 (no hay cantidades negativas ni cero).
//  • Productos agotados no se pueden agregar.
//  • refreshStock() consulta el stock actual y ajusta el carrito si cambió.

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

  const quantityOf = useCallback(
    (id) => cart.find((item) => item.id === id)?.quantity || 0,
    [cart]
  )

  const addItem = useCallback((product, qty = 1) => {
    const amount = Math.floor(Number(qty))
    if (!amount || amount < 1) return false
    if (product.stock <= 0) {
      showToast(`"${product.name}" está agotado.`, 'error')
      return false
    }

    const current = cart.find((item) => item.id === product.id)?.quantity || 0
    const available = product.stock - current
    if (available <= 0) {
      showToast(`Ya tienes todas las unidades disponibles (${product.stock}) en tu carrito.`, 'warning')
      return false
    }
    const toAdd = Math.min(amount, available)

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id)
      if (idx !== -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], stock: product.stock, quantity: updated[idx].quantity + toAdd }
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
          quantity: toAdd,
        },
      ]
    })

    if (toAdd < amount) {
      showToast(`Solo se agregaron ${toAdd}: no hay más unidades disponibles.`, 'warning')
    } else {
      showToast(`"${product.name}" agregado al carrito.`, 'success')
    }
    return true
  }, [cart, showToast])

  /** Fija la cantidad de un producto entre 1 y su stock disponible. */
  const setQuantity = useCallback((id, quantity) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const q = Math.max(1, Math.min(item.stock, Math.floor(Number(quantity)) || 1))
        return { ...item, quantity: q }
      })
    )
  }, [])

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  /**
   * Consulta el stock actual de los productos del carrito. Si un producto ya no
   * existe, está inactivo o agotado se quita; si hay menos stock se ajusta.
   */
  const refreshStock = useCallback(async () => {
    if (cart.length === 0) return
    try {
      const products = await api.get('/products?status=Activo', { auth: false })
      const byId = new Map(products.map((p) => [p.id, p]))
      const messages = []
      const next = cart.flatMap((item) => {
        const p = byId.get(item.id)
        if (!p || p.stock <= 0) {
          messages.push(`"${item.name}" ya no está disponible y se quitó del carrito.`)
          return []
        }
        const quantity = Math.min(item.quantity, p.stock)
        if (quantity < item.quantity) {
          messages.push(`Solo quedan ${p.stock} de "${item.name}"; ajustamos tu carrito.`)
        }
        return [{ ...item, price: p.price, stock: p.stock, quantity }]
      })
      setCart(next)
      if (messages.length) showToast(messages[0], 'warning')
    } catch { /* sin conexión: se valida de nuevo en el checkout */ }
  }, [cart, showToast])

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
    const invalid = cart.find((item) => item.quantity < 1 || item.quantity > item.stock)
    if (invalid) {
      return { ok: false, reason: 'stock', message: `La cantidad de "${invalid.name}" supera el stock disponible.` }
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

  const value = {
    cart, total, itemCount,
    quantityOf, addItem, setQuantity, removeItem, clearCart, refreshStock, checkout,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
