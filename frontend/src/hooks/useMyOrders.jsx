import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

/**
 * useMyOrders
 * ─────────────
 * Historial de pedidos del cliente autenticado.
 */
export function useMyOrders() {
  const { showToast } = useToast()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/orders/mine')
      setOrders(data)
    } catch (err) {
      showToast(err.message || 'No se pudo cargar tu historial de pedidos.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  return { orders, loading, reload: load }
}
