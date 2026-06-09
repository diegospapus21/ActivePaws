const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { readDB, writeDB, nextId } = require('../db/database')
const { JWT_SECRET } = require('../middleware/auth')

const router = express.Router()

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
// Recibe: { username, password }
// Devuelve: { token, user: { id, name, username, role } }
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' })
    }

    const db   = readDB()
    const user = db.users.find(u => u.username === username)

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' })
    }

    if (user.status === 'Inactivo') {
      return res.status(403).json({ message: 'Tu cuenta está desactivada.' })
    }

    // Generar JWT válido por 8 horas
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message })
  }
})

// ─── POST /api/auth/register ───────────────────────────────────────────────────
// Recibe: { name, email, username, password }
// Devuelve: { message, user: { id, name, username } }
router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' })
    }

    const db = readDB()

    // Verificar que username y email no existan
    const usernameExists = db.users.find(u => u.username === username)
    if (usernameExists) {
      return res.status(409).json({ message: 'Ese nombre de usuario ya está en uso.' })
    }

    const emailExists = db.users.find(u => u.email === email)
    if (emailExists) {
      return res.status(409).json({ message: 'Ese correo ya está registrado.' })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      id:       nextId('users'),
      name,
      email,
      username,
      password: hashedPassword,
      role:     'client',
      status:   'Activo',
    }

    db.users.push(newUser)
    writeDB(db)

    res.status(201).json({
      message: '¡Cuenta creada exitosamente!',
      user: { id: newUser.id, name: newUser.name, username: newUser.username },
    })
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message })
  }
})

module.exports = router
