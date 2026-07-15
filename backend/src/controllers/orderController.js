const Order   = require('../models/Order')
const Product = require('../models/Product')
const User    = require('../models/User')

const STATUS_VALIDOS = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']

const todayStr = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

// Genera un número de pedido de 6 dígitos único, secuencial
async function makeOrderNumber() {
  const last = await Order.findOne().sort({ orderNumber: -1 })
  const nextNum = last ? Number(last.orderNumber) + 1 : 1001
  return String(nextNum).padStart(6, '0')
}

// ─── GET /api/orders ───────────────────────────────────────────────────────────
// Solo admin: lista todos los pedidos
async function getOrders(req, res) {
  try {
    const { search, status } = req.query
    const filter = {}
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { client: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
      ]
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders.map(o => ({ ...o.toJSON(), displayId: o.orderNumber })))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pedidos.', error: err.message })
  }
}

// ─── GET /api/orders/mine ───────────────────────────────────────────────────────
// Cliente autenticado: solo sus propios pedidos (historial)
async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(orders.map(o => o.toJSON()))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tus pedidos.', error: err.message })
  }
}

// ─── GET /api/orders/:id ───────────────────────────────────────────────────────
// Admin o el dueño del pedido
async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' })
    if (req.user.role !== 'admin' && String(order.userId) !== req.user.id) {
      return res.status(403).json({ message: 'Sin permisos para ver este pedido.' })
    }
    res.json(order.toJSON())
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el pedido.', error: err.message })
  }
}

// ─── POST /api/orders/checkout ─────────────────────────────────────────────────
// Cliente autenticado y con correo confirmado: crea un pedido a partir de su
// carrito. Valida stock, descuenta inventario y suma unidades vendidas.
async function checkout(req, res) {
  try {
    const { items, shipping } = req.body   // items: [{ productId, qty }]

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

    const orderItems = []
    let total = 0

    // Validar stock y armar los ítems del pedido
    for (const it of items) {
      const product = await Product.findById(it.productId)
      if (!product) return res.status(404).json({ message: `Producto ${it.productId} no encontrado.` })
      if (product.status !== 'Activo') {
        return res.status(400).json({ message: `"${product.name}" ya no está disponible.` })
      }
      const qty = Number(it.qty) || 1
      if (product.stock < qty) {
        return res.status(400).json({ message: `Stock insuficiente para "${product.name}".` })
      }
      orderItems.push({ productId: product._id, name: product.name, price: product.price, qty })
      total += product.price * qty
    }

    // Descontar stock y sumar vendidos
    for (const it of orderItems) {
      await Product.updateOne(
        { _id: it.productId },
        { $inc: { stock: -it.qty, sold: it.qty } }
      )
    }

    const orderNumber = await makeOrderNumber()

    const newOrder = await Order.create({
      orderNumber,
      userId: user._id,
      client: user.name,
      avatar: user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      total,
      currency: 'MXN',
      status: 'Pendiente',
      date: todayStr(),
      items: orderItems,
      shipping: shipping || null,
    })

    res.status(201).json({ message: '¡Compra realizada con éxito!', order: newOrder.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar la compra.', error: err.message })
  }
}

// ─── POST /api/orders ──────────────────────────────────────────────────────────
// Solo admin: crear pedido manual desde el panel administrativo
async function createOrder(req, res) {
  try {
    const { client, total, currency, status, date, items } = req.body

    if (!client || total === undefined) {
      return res.status(400).json({ message: 'Cliente y total son requeridos.' })
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Use: ${STATUS_VALIDOS.join(', ')}` })
    }

    const matchedUser = await User.findOne({ name: new RegExp(`^${client}$`, 'i') })
    const orderNumber = await makeOrderNumber()

    const newOrder = await Order.create({
      orderNumber,
      userId: matchedUser ? matchedUser._id : null,
      client: client.trim(),
      avatar: client.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      total: Number(total),
      currency: currency || 'MXN',
      status: status || 'Pendiente',
      date: date || todayStr(),
      items: Array.isArray(items) ? items : [],
    })

    res.status(201).json({ message: 'Pedido creado correctamente.', order: newOrder.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el pedido.', error: err.message })
  }
}

// ─── PUT /api/orders/:id ───────────────────────────────────────────────────────
// Solo admin
async function updateOrder(req, res) {
  try {
    const { client, total, currency, status, date, items } = req.body

    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ message: `Estado inválido. Use: ${STATUS_VALIDOS.join(', ')}` })
    }

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' })

    if (client !== undefined) {
      order.client = client.trim()
      order.avatar = client.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }
    if (total !== undefined)    order.total = Number(total)
    if (currency !== undefined) order.currency = currency
    if (status !== undefined)   order.status = status
    if (date !== undefined)     order.date = date
    if (items !== undefined)    order.items = items

    await order.save()
    res.json({ message: 'Pedido actualizado.', order: order.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el pedido.', error: err.message })
  }
}

// ─── DELETE /api/orders/:id ────────────────────────────────────────────────────
// Solo admin
async function deleteOrder(req, res) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' })
    res.json({ message: 'Pedido eliminado.', order: order.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el pedido.', error: err.message })
  }
}

module.exports = {
  getOrders, getMyOrders, getOrderById, checkout,
  createOrder, updateOrder, deleteOrder,
}
