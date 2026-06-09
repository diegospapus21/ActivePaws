const express = require('express')
const { readDB, writeDB, nextId } = require('../db/database')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

const router = express.Router()

// ─── GET /api/products ─────────────────────────────────────────────────────────
// Público. Soporta ?category=, ?search=, ?status=
router.get('/', (req, res) => {
  try {
    const { category, search, status } = req.query
    let products = readDB().products

    if (category) {
      products = products.filter(p =>
        p.category.toLowerCase().includes(category.toLowerCase())
      )
    }
    if (status) {
      products = products.filter(p => p.status === status)
    }
    if (search) {
      const q = search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    }

    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos.', error: err.message })
  }
})

// ─── GET /api/products/:id ─────────────────────────────────────────────────────
// Público
router.get('/:id', (req, res) => {
  try {
    const db      = readDB()
    const product = db.products.find(p => p.id === Number(req.params.id))
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el producto.', error: err.message })
  }
})

// ─── POST /api/products ────────────────────────────────────────────────────────
// Solo admin
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { name, category, price, currency, stock, description, status, image } = req.body

    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Nombre, categoría, precio y stock son requeridos.' })
    }

    const db = readDB()

    const newProduct = {
      id:          nextId('products'),
      name:        name.trim(),
      category,
      price:       Number(price),
      currency:    currency || 'MXN',
      stock:       Number(stock),
      sold:        0,
      description: description || '',
      status:      status || 'Activo',
      image:       image || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop',
      tags:        [],
    }

    db.products.push(newProduct)
    writeDB(db)

    res.status(201).json({ message: 'Producto creado correctamente.', product: newProduct })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el producto.', error: err.message })
  }
})

// ─── PUT /api/products/:id ─────────────────────────────────────────────────────
// Solo admin
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db  = readDB()
    const idx = db.products.findIndex(p => p.id === Number(req.params.id))

    if (idx === -1) return res.status(404).json({ message: 'Producto no encontrado.' })

    const { name, category, price, currency, stock, description, status, image } = req.body

    db.products[idx] = {
      ...db.products[idx],
      ...(name        && { name: name.trim() }),
      ...(category    && { category }),
      ...(price !== undefined && { price: Number(price) }),
      ...(currency    && { currency }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(description !== undefined && { description }),
      ...(status      && { status }),
      ...(image       && { image }),
    }

    writeDB(db)
    res.json({ message: 'Producto actualizado.', product: db.products[idx] })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el producto.', error: err.message })
  }
})

// ─── DELETE /api/products/:id ──────────────────────────────────────────────────
// Solo admin
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db  = readDB()
    const idx = db.products.findIndex(p => p.id === Number(req.params.id))

    if (idx === -1) return res.status(404).json({ message: 'Producto no encontrado.' })

    const deleted = db.products.splice(idx, 1)[0]
    writeDB(db)

    res.json({ message: 'Producto eliminado.', product: deleted })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message })
  }
})

module.exports = router
