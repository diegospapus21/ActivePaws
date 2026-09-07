const express = require('express')
const { verifyToken } = require('../middleware/auth')
const authController = require('../controllers/authController')

const router = express.Router()

router.post('/login',             authController.login)
router.post('/register',          authController.register)
router.post('/verify-code',       authController.verifyCode)
router.post('/resend-code',       authController.resendCode)
router.post('/forgot-password',   authController.forgotPassword)
router.post('/reset-password',    authController.resetPassword)
router.get('/me',       verifyToken, authController.me)
router.get('/mail-status',        authController.mailStatus)

module.exports = router
