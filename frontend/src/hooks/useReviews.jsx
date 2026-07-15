import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

/**
 * useReviews
 * ────────────
 * Maneja las reseñas de un producto: listado público + publicación
 * restringida a clientes que compraron y recibieron el producto.
 */
export function useReviews(productId) {
  const { isLogged, isConfirmed } = useAuth()
  const { showToast } = useToast()

  const [reviews, setReviews]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(false)

  const loadReviews = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    try {
      const data = await api.get(`/reviews?productId=${productId}`, { auth: false })
      setReviews(data)
    } catch (err) {
      showToast(err.message || 'No se pudieron cargar las reseñas.', 'error')
    } finally {
      setLoading(false)
    }
  }, [productId, showToast])

  const checkEligibility = useCallback(async () => {
    if (!productId || !isLogged) { setCanReview(false); return }
    setCheckingEligibility(true)
    try {
      const res = await api.get(`/reviews/can-review/${productId}`)
      setCanReview(res.canReview)
    } catch {
      setCanReview(false)
    } finally {
      setCheckingEligibility(false)
    }
  }, [productId, isLogged])

  useEffect(() => { loadReviews() }, [loadReviews])
  useEffect(() => { checkEligibility() }, [checkEligibility])

  const submitReview = async (rating, comment) => {
    if (!isLogged) return { ok: false, message: 'Debes iniciar sesión para dejar una reseña.' }
    if (!isConfirmed) return { ok: false, message: 'Debes confirmar tu correo electrónico primero.' }

    try {
      await api.post('/reviews', { productId: Number(productId), rating, comment })
      await loadReviews()
      await checkEligibility()
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message || 'No se pudo publicar la reseña.' }
    }
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return { reviews, loading, avg, canReview, checkingEligibility, submitReview, reload: loadReviews }
}
