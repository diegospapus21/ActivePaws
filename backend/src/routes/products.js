const express = require('express')
const { verifyToken, verifyAdmin } = require('../middleware/auth')
const productController = require('../controllers/productController')

const router = express.Router()

router.get('/',      productController.getProducts)
router.get('/:id',   productController.getProductById)
router.post('/',     verifyToken, verifyAdmin, productController.createProduct)
router.put('/:id',   verifyToken, verifyAdmin, productController.updateProduct)
router.delete('/:id',verifyToken, verifyAdmin, productController.deleteProduct)

module.exports = router
