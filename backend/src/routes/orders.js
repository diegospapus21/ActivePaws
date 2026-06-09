const express = require('express')
const { readDB, writeDB } = require('../db/database')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

const router = express.Router()

const STATUS_VALIDOS = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']

// ─── GET /api/orders ───────────────────────────────────────────────────────────
// Solo admin
router.get('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { search, status } = req.query
    let orders = readDB().orders

    if (status) orders = orders.filter(o => o.status === status)
    if (search) {
      const q = search.toLowerCase()
      orders = orders.filter(o =>
        o.client.toLowerCase().includes(q) ||
        o.id.includes(q)
      )
    }

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos.', error: err.message })
  }
})

// ─── GET /api/orders/:id ───────────────────────────────────────────────────────
// Solo admin
router.get('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db    = readDB()
    const order = db.orders.find(o => o.id === req.params.id)
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el pedido.', error: err.message })
  }
})

// ─── POST /api/orders ──────────────────────────────────────────────────────────
// Solo admin
router.post('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { client, total, currency, status, date, items } = req.body

    if (!client || total === undefined) {
      return res.status(400).json({ message: 'Cliente y total son requeridos.' })
    }

    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Use: ${STATUS_VALIDOS.join(', ')}` })
    }

    const db = readDB()

    // Generar ID de 6 dígitos único
    const maxId = db.orders.reduce((max, o) => {
      const n = Number(o.id); return n > max ? n : max
    }, db.nextId.orders)
    db.nextId.orders = maxId + 1

    const newId = String(maxId + 1).padStart(6, '0')

    const todayStr = () => {
      const d = new Date()
      return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
    }

    const avatar = client.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

    const newOrder = {
      id:       newId,
      client:   client.trim(),
      avatar,
      total:    Number(total),
      currency: currency || 'MXN',
      status:   status || 'Pendiente',
      date:     date || todayStr(),
      items:    Number(items) || 1,
    }

    db.orders.unshift(newOrder)   // agregar al inicio
    writeDB(db)

    res.status(201).json({ message: 'Pedido creado correctamente.', order: newOrder })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el pedido.', error: err.message })
  }
})

// ─── PUT /api/orders/:id ───────────────────────────────────────────────────────
// Solo admin
router.put('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db  = readDB()
    const idx = db.orders.findIndex(o => o.id === req.params.id)

    if (idx === -1) return res.status(404).json({ message: 'Pedido no encontrado.' })

    const { client, total, currency, status, date, items } = req.body

    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Use: ${STATUS_VALIDOS.join(', ')}` })
    }

    db.orders[idx] = {
      ...db.orders[idx],
      ...(client   && { client: client.trim(), avatar: client.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() }),
      ...(total !== undefined && { total: Number(total) }),
      ...(currency && { currency }),
      ...(status   && { status }),
      ...(date     && { date }),
      ...(items !== undefined && { items: Number(items) }),
    }

    writeDB(db)
    res.json({ message: 'Pedido actualizado.', order: db.orders[idx] })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el pedido.', error: err.message })
  }
})

// ─── DELETE /api/orders/:id ────────────────────────────────────────────────────
// Solo admin
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db  = readDB()
    const idx = db.orders.findIndex(o => o.id === req.params.id)

    if (idx === -1) return res.status(404).json({ message: 'Pedido no encontrado.' })

    const deleted = db.orders.splice(idx, 1)[0]
    writeDB(db)

    res.json({ message: 'Pedido eliminado.', order: deleted })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el pedido.', error: err.message })
  }
})

module.exports = router
