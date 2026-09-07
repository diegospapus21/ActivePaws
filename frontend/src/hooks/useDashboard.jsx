import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

/**
 * useDashboard
 * ──────────────
 * Estadísticas del panel de administración (backend real).
 */
export function useDashboard() {
  const { showToast } = useToast()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/dashboard')
      setData(res)
    } catch (err) {
      showToast(err.message || 'No se pudieron cargar las estadísticas.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { load() }, [load])

  return { data, loading, reload: load }
}
