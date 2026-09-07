import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useReviews } from '../hooks/useReviews'
import { useProductDetail } from '../hooks/usePublicProducts'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => !readonly && onChange?.(n)}
          className={readonly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star size={16} className={n <= value ? 'text-paw-400 fill-paw-400' : 'text-cream-300'} />
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const { id } = useParams()
  const { product } = useProductDetail(id)
  const { reviews, loading, avg, canReview, checkingEligibility, submitReview } = useReviews(id)
  const { isLogged } = useAuth()
  const { showToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')

  const handleSubmit = async () => {
    if (!newRating || !newComment.trim()) return
    const result = await submitReview(newRating, newComment.trim())
    if (!result.ok) {
      showToast(result.message, 'error')
      return
    }
    showToast('¡Gracias por tu reseña!', 'success')
    setNewRating(0)
    setNewComment('')
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-cream-100 paw-bg pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to={id ? `/producto/${id}` : '/'} className="text-paw-500 hover:text-paw-600">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-cursive text-2xl text-bark-800">
            Reseñas {product ? `— ${product.name}` : ''}
          </h1>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-paw-600">{avg}</span>
            <div>
              <StarRating value={Math.round(avg)} readonly />
              <p className="text-xs text-bark-400 mt-0.5">({reviews.length} reseñas)</p>
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="flex flex-col gap-4 mb-6">
          {loading && <p className="text-center text-bark-400 text-sm">Cargando reseñas...</p>}
          {!loading && reviews.length === 0 && (
            <p className="text-center text-bark-400 text-sm">Este producto aún no tiene reseñas.</p>
          )}
          {reviews.map(r => (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-bark-700 text-sm">{r.userName}</span>
                <span className="text-xs text-bark-400">{r.date}</span>
              </div>
              <StarRating value={r.rating} readonly />
              <p className="text-sm text-bark-600 mt-2 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Write review button / form */}
        {!isLogged ? (
          <p className="text-center text-xs text-bark-400">
            <Link to="/login" className="text-paw-600 font-semibold hover:underline">Inicia sesión</Link>{' '}
            para poder dejar una reseña de este producto.
          </p>
        ) : checkingEligibility ? (
          <p className="text-center text-xs text-bark-400">Verificando si puedes reseñar este producto...</p>
        ) : !canReview ? (
          <p className="text-center text-xs text-bark-400 bg-cream-100 rounded-lg p-3">
            Solo puedes reseñar productos que hayas comprado y que ya te hayan sido entregados.
          </p>
        ) : !showForm ? (
          <button onClick={() => setShowForm(true)} className="btn-primary w-full">
            Escribir reseña
          </button>
        ) : (
          <div className="card flex flex-col gap-3">
            <h3 className="font-semibold text-bark-700">Tu reseña</h3>
            <StarRating value={newRating} onChange={setNewRating} />
            <textarea
              className="input-field resize-none h-24 text-sm"
              placeholder="Cuéntanos tu experiencia..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-2 text-sm">Cancelar</button>
              <button onClick={handleSubmit} className="btn-primary flex-1 py-2 text-sm">Publicar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
