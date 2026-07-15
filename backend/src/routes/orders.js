const express = require('express')
const { verifyToken, verifyAdmin, verifyConfirmed } = require('../middleware/auth')
const orderController = require('../controllers/orderController')

const router = express.Router()

router.get('/',          verifyToken, verifyAdmin, orderController.getOrders)
router.get('/mine',      verifyToken,               orderController.getMyOrders)
router.get('/:id',       verifyToken,               orderController.getOrderById)
router.post('/checkout', verifyToken, verifyConfirmed, orderController.checkout)
router.post('/',         verifyToken, verifyAdmin, orderController.createOrder)
router.put('/:id',       verifyToken, verifyAdmin, orderController.updateOrder)
router.delete('/:id',    verifyToken, verifyAdmin, orderController.deleteOrder)

module.exports = router
