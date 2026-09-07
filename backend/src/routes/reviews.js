const express = require('express')
const { verifyToken, verifyConfirmed } = require('../middleware/auth')
const reviewController = require('../controllers/reviewController')

const router = express.Router()

router.get('/',                    reviewController.getReviews)
router.get('/can-review/:productId', verifyToken, reviewController.canReview)
router.post('/',                   verifyToken, verifyConfirmed, reviewController.createReview)
router.delete('/:id',              verifyToken, reviewController.deleteReview)

module.exports = router
