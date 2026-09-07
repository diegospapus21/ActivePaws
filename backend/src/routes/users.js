const express = require('express')
const { verifyToken, verifyAdmin } = require('../middleware/auth')
const userController = require('../controllers/userController')

const router = express.Router()

router.get('/',       verifyToken, verifyAdmin, userController.getUsers)
router.get('/:id',    verifyToken,               userController.getUserById)
router.post('/',      verifyToken, verifyAdmin, userController.createUser)
router.put('/:id',    verifyToken, verifyAdmin, userController.updateUser)
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser)

module.exports = router
