const Product = require('../models/Product')
const Review  = require('../models/Review')

// ─── GET /api/products ─────────────────────────────────────────────────────────
// Público. Soporta ?category=, ?search=, ?status=
async function getProducts(req, res) {
  try {
    const { category, search, status } = req.query
    const filter = {}

    if (category) filter.category = { $regex: category, $options: 'i' }
    if (status)   filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products.map(p => p.toJSON()))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos.', error: err.message })
  }
}

// ─── GET /api/products/:id ─────────────────────────────────────────────────────
// Público. Incluye calificación promedio calculada a partir de las reseñas.
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' })

    const productReviews = await Review.find({ productId: product._id })
    const avgRating = productReviews.length
      ? productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length
      : 0

    res.json({ ...product.toJSON(), avgRating: Number(avgRating.toFixed(1)), reviewCount: productReviews.length })
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el producto.', error: err.message })
  }
}

// ─── POST /api/products ────────────────────────────────────────────────────────
// Solo admin
async function createProduct(req, res) {
  try {
    const { name, category, price, currency, stock, description, status, image } = req.body

    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Nombre, categoría, precio y stock son requeridos.' })
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price: Number(price),
      currency: currency || 'MXN',
      stock: Number(stock),
      sold: 0,
      description: description || '',
      status: status || 'Activo',
      image: image || undefined,
      tags: [],
    })

    res.status(201).json({ message: 'Producto creado correctamente.', product: product.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el producto.', error: err.message })
  }
}

// ─── PUT /api/products/:id ─────────────────────────────────────────────────────
// Solo admin
async function updateProduct(req, res) {
  try {
    const { name, category, price, currency, stock, description, status, image } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' })

    if (name !== undefined)        product.name = name.trim()
    if (category !== undefined)    product.category = category
    if (price !== undefined)       product.price = Number(price)
    if (currency !== undefined)    product.currency = currency
    if (stock !== undefined)       product.stock = Number(stock)
    if (description !== undefined) product.description = description
    if (status !== undefined)      product.status = status
    if (image !== undefined)       product.image = image

    await product.save()
    res.json({ message: 'Producto actualizado.', product: product.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el producto.', error: err.message })
  }
}

// ─── DELETE /api/products/:id ──────────────────────────────────────────────────
// Solo admin
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' })
    res.json({ message: 'Producto eliminado.', product: product.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message })
  }
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct }
