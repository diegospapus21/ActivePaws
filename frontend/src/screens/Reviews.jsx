import { useState } from 'react'
import { Star, ShoppingCart, Menu } from 'lucide-react'
import MobileNav from '../components/MobileNav'

const mockReviews = [
  { id: 1, user: 'María G.', rating: 5, comment: 'Excelente calidad, mi perrito quedó muy cómodo.', date: '10/03/2026' },
  { id: 2, user: 'Carlos R.', rating: 4, comment: 'Bonito diseño aunque tardó un poco en llegar.', date: '08/03/2026' },
  { id: 3, user: 'Ana P.',    rating: 5, comment: 'Mi gata lo usa todos los días, perfecto material.', date: '05/03/2026' },
]

function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => !readonly && onChange?.(n)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <Star
            size={16}
            className={n <= value ? 'text-paw-400 fill-paw-400' : 'text-cream-300'}
          />
        </button>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState(mockReviews)
  const [showForm, setShowForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  const total = reviews.length + 231  // simulated total

  const handleSubmit = () => {
    if (!newRating || !newComment.trim()) return
    setReviews([
      { id: Date.now(), user: 'Tú', rating: newRating, comment: newComment, date: new Date().toLocaleDateString('es-MX') },
      ...reviews,
    ])
    setNewRating(0)
    setNewComment('')
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-cream-100 paw-bg pb-20 md:pb-0">
      {/* Mobile header */}
      <header className="flex items-center justify-between px-4 py-3 bg-cream-50 border-b border-cream-200 sticky top-0 z-40">
        <button><Menu size={20} className="text-bark-600" /></button>
        <h1 className="font-cursive text-xl text-bark-800">Reseñas</h1>
        <button className="relative">
          <ShoppingCart size={20} className="text-bark-600" />
          <span className="absolute -top-1 -right-1 bg-paw-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-paw-600">{avg}</span>
            <div>
              <StarRating value={Math.round(avg)} readonly />
              <p className="text-xs text-bark-400 mt-0.5">({total.toLocaleString()})</p>
            </div>
          </div>
          <select className="input-field py-1.5 text-xs w-auto">
            <option>Ordenar por</option>
            <option>Más recientes</option>
            <option>Mejor puntuados</option>
          </select>
        </div>

        {/* Rating bars */}
        <div className="flex flex-col gap-1.5 mb-6">
          {[5, 4, 3, 2, 1].map(n => {
            const count = reviews.filter(r => r.rating === n).length
            const pct = total > 0 ? (count / total) * 100 : 0
            return (
              <div key={n} className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2].map(i => (
                    <Star key={i} size={12} className={i <= (n > 3 ? 2 : 1) ? 'text-paw-400 fill-paw-400' : 'text-cream-300'} />
                  ))}
                </div>
                <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-paw-400 rounded-full transition-all"
                    style={{ width: `${pct + n * 10}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Reviews list */}
        <div className="flex flex-col gap-4 mb-6">
          {reviews.map(r => (
            <div key={r.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-bark-700 text-sm">{r.user}</span>
                <span className="text-xs text-bark-400">{r.date}</span>
              </div>
              <StarRating value={r.rating} readonly />
              <p className="text-sm text-bark-600 mt-2 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>

        {/* Write review button / form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary w-full"
          >
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

      <MobileNav />
    </div>
  )
}
