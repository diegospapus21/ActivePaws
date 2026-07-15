import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

/**
 * usePublicProducts
 * ───────────────────
 * Trae el catálogo público de productos desde el backend (sin autenticación).
 * Opcionalmente filtra por categoría.
 */
export function usePublicProducts(category) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = category ? `?category=${encodeURIComponent(category)}` : ''
      const data = await api.get(`/products${query}`, { auth: false })
      setProducts(data.filter(p => p.status === 'Activo'))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => { load() }, [load])

  return { products, loading, error, reload: load }
}

/**
 * useProductDetail
 * ──────────────────
 * Trae un producto individual (con avgRating/reviewCount) por id.
 */
export function useProductDetail(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api.get(`/products/${id}`, { auth: false })
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}
