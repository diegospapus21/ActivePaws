const Review  = require('../models/Review')
const Product = require('../models/Product')
const Order   = require('../models/Order')
const User    = require('../models/User')

const todayStr = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

// ─── GET /api/reviews?productId= ───────────────────────────────────────────────
// Público: reseñas de un producto (o todas si no se especifica productId)
async function getReviews(req, res) {
  try {
    const { productId } = req.query
    const filter = productId ? { productId } : {}
    const reviews = await Review.find(filter).sort({ createdAt: -1 })
    res.json(reviews.map(r => r.toJSON()))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener reseñas.', error: err.message })
  }
}

// ─── GET /api/reviews/can-review/:productId ────────────────────────────────────
// Indica si el usuario autenticado puede reseñar un producto (lo compró y le
// fue entregado, y aún no lo ha reseñado).
async function canReview(req, res) {
  try {
    const { productId } = req.params

    const purchased = await Order.exists({
      userId: req.user.id,
      status: 'Entregado',
      items: { $elemMatch: { productId } },
    })
    const alreadyReviewed = await Review.exists({ productId, userId: req.user.id })

    res.json({ canReview: Boolean(purchased) && !alreadyReviewed, purchased: Boolean(purchased), alreadyReviewed: Boolean(alreadyReviewed) })
  } catch (err) {
    res.status(500).json({ message: 'Error al validar la reseña.', error: err.message })
  }
}

// ─── POST /api/reviews ──────────────────────────────────────────────────────────
// Cliente autenticado y confirmado. Solo puede reseñar productos que haya
// comprado y que ya le hayan sido entregados. Una reseña por producto/usuario.
async function createReview(req, res) {
  try {
    const { productId, rating, comment } = req.body
    const r = Number(rating)

    if (!productId || !r || r < 1 || r > 5 || !comment || !comment.trim()) {
      return res.status(400).json({ message: 'Producto, calificación (1-5) y comentario son requeridos.' })
    }

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' })

    const purchased = await Order.exists({
      userId: req.user.id,
      status: 'Entregado',
      items: { $elemMatch: { productId } },
    })
    if (!purchased) {
      return res.status(403).json({ message: 'Solo puedes reseñar productos que hayas comprado y recibido.' })
    }

    if (await Review.exists({ productId, userId: req.user.id })) {
      return res.status(409).json({ message: 'Ya has escrito una reseña para este producto.' })
    }

    const user = await User.findById(req.user.id)

    const newReview = await Review.create({
      productId,
      userId: req.user.id,
      userName: user ? user.name : 'Usuario',
      rating: r,
      comment: comment.trim(),
      date: todayStr(),
    })

    res.status(201).json({ message: '¡Gracias por tu reseña!', review: newReview.toJSON() })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya has escrito una reseña para este producto.' })
    }
    res.status(500).json({ message: 'Error al publicar la reseña.', error: err.message })
  }
}

// ─── DELETE /api/reviews/:id ────────────────────────────────────────────────────
// El propio autor de la reseña o un admin
async function deleteReview(req, res) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Reseña no encontrada.' })

    if (String(review.userId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sin permisos para eliminar esta reseña.' })
    }

    await review.deleteOne()
    res.json({ message: 'Reseña eliminada.', review: review.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la reseña.', error: err.message })
  }
}

module.exports = { getReviews, canReview, createReview, deleteReview }
