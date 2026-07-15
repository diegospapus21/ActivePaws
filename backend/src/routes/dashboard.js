const express = require('express')
const { verifyToken, verifyAdmin } = require('../middleware/auth')
const dashboardController = require('../controllers/dashboardController')

const router = express.Router()

router.get('/', verifyToken, verifyAdmin, dashboardController.getDashboard)

module.exports = router
