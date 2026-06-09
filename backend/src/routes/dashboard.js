const express = require('express')
const { readDB } = require('../db/database')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

const router = express.Router()

// ─── GET /api/dashboard ────────────────────────────────────────────────────────
// Devuelve todas las estadísticas que necesita el Dashboard del admin
router.get('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db = readDB()

    const totalProducts = db.products.length
    const activeProducts = db.products.filter(p => p.status === 'Activo').length
    const lowStock = db.products.filter(p => p.stock <= 10).length

    const totalOrders   = db.orders.length
    const pendingOrders = db.orders.filter(o => o.status === 'Pendiente').length
    const totalRevenue  = db.orders
      .filter(o => o.status !== 'Cancelado')
      .reduce((sum, o) => sum + Number(o.total), 0)

    const totalUsers  = db.users.length
    const activeUsers = db.users.filter(u => u.status === 'Activo').length

    // Top 5 productos más vendidos
    const topProducts = [...db.products]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map(({ id, name, sold, stock, image }) => ({ id, name, sold, stock, image }))

    // Distribución de pedidos por estado
    const ordersByStatus = STATUS_LIST => STATUS_LIST.map(s => ({
      status: s,
      count: db.orders.filter(o => o.status === s).length,
    }))

    res.json({
      stats: {
        totalProducts, activeProducts, lowStock,
        totalOrders, pendingOrders, totalRevenue,
        totalUsers, activeUsers,
      },
      topProducts,
      ordersByStatus: ordersByStatus(['Pendiente', 'Enviado', 'Entregado', 'Cancelado']),
    })
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas.', error: err.message })
  }
})

// Helper local
function STATUS_LIST(arr) { return arr }

module.exports = router
