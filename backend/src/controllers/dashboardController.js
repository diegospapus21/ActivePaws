const Product = require('../models/Product')
const Order   = require('../models/Order')
const User    = require('../models/User')

// ─── GET /api/dashboard ────────────────────────────────────────────────────────
// Devuelve todas las estadísticas que necesita el Dashboard del admin
async function getDashboard(req, res) {
  try {
    const [totalProducts, activeProducts, lowStock, totalOrders, pendingOrders,
           totalUsers, activeUsers, orders, topProductsRaw] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'Activo' }),
      Product.countDocuments({ stock: { $lte: 10 } }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pendiente' }),
      User.countDocuments(),
      User.countDocuments({ status: 'Activo' }),
      Order.find({ status: { $ne: 'Cancelado' } }),
      Product.find().sort({ sold: -1 }).limit(5),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)

    const topProducts = topProductsRaw.map(p => ({
      id: p._id.toString(), name: p.name, sold: p.sold, stock: p.stock, image: p.image,
    }))

    const statusList = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']
    const ordersByStatus = await Promise.all(
      statusList.map(async (status) => ({ status, count: await Order.countDocuments({ status }) }))
    )

    res.json({
      stats: {
        totalProducts, activeProducts, lowStock,
        totalOrders, pendingOrders, totalRevenue,
        totalUsers, activeUsers,
      },
      topProducts,
      ordersByStatus,
    })
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estadísticas.', error: err.message })
  }
}

module.exports = { getDashboard }
