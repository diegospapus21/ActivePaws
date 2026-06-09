const express = require('express')
const bcrypt  = require('bcryptjs')
const { readDB, writeDB, nextId } = require('../db/database')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

const router = express.Router()

// ─── GET /api/users ────────────────────────────────────────────────────────────
// Solo admin. Nunca devuelve contraseñas.
router.get('/', verifyToken, verifyAdmin, (req, res) => {
  try {
    const { search, role, status } = req.query
    let users = readDB().users.map(({ password: _pw, ...u }) => u)  // omitir password

    if (search) {
      const q = search.toLowerCase()
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
    }
    if (role)   users = users.filter(u => u.role === role)
    if (status) users = users.filter(u => u.status === status)

    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios.', error: err.message })
  }
})

// ─── GET /api/users/:id ────────────────────────────────────────────────────────
// El propio usuario o admin
router.get('/:id', verifyToken, (req, res) => {
  try {
    const id = Number(req.params.id)
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sin permisos.' })
    }

    const db   = readDB()
    const user = db.users.find(u => u.id === id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

    const { password: _pw, ...safeUser } = user
    res.json(safeUser)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el usuario.', error: err.message })
  }
})

// ─── POST /api/users ───────────────────────────────────────────────────────────
// Solo admin puede crear usuarios directamente
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, email, username, password, role, status } = req.body

    if (!name || !email || !username) {
      return res.status(400).json({ message: 'Nombre, correo y usuario son requeridos.' })
    }

    const db = readDB()

    if (db.users.find(u => u.username === username)) {
      return res.status(409).json({ message: 'Ese nombre de usuario ya existe.' })
    }
    if (db.users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'Ese correo ya está registrado.' })
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10)

    const newUser = {
      id:       nextId('users'),
      name:     name.trim(),
      email:    email.trim(),
      username: username.trim(),
      password: hashedPassword,
      role:     role || 'client',
      status:   status || 'Activo',
    }

    db.users.push(newUser)
    writeDB(db)

    const { password: _pw, ...safeUser } = newUser
    res.status(201).json({ message: 'Usuario creado correctamente.', user: safeUser })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el usuario.', error: err.message })
  }
})

// ─── PUT /api/users/:id ────────────────────────────────────────────────────────
// Solo admin
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db  = readDB()
    const idx = db.users.findIndex(u => u.id === Number(req.params.id))

    if (idx === -1) return res.status(404).json({ message: 'Usuario no encontrado.' })

    const { name, email, username, password, role, status } = req.body

    // Si envían nueva contraseña, hashearla
    let hashedPassword
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    db.users[idx] = {
      ...db.users[idx],
      ...(name     && { name: name.trim() }),
      ...(email    && { email: email.trim() }),
      ...(username && { username: username.trim() }),
      ...(role     && { role }),
      ...(status   && { status }),
      ...(hashedPassword && { password: hashedPassword }),
    }

    writeDB(db)

    const { password: _pw, ...safeUser } = db.users[idx]
    res.json({ message: 'Usuario actualizado.', user: safeUser })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el usuario.', error: err.message })
  }
})

// ─── DELETE /api/users/:id ─────────────────────────────────────────────────────
// Solo admin
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  try {
    const db  = readDB()
    const idx = db.users.findIndex(u => u.id === Number(req.params.id))

    if (idx === -1) return res.status(404).json({ message: 'Usuario no encontrado.' })

    // No permitir eliminar el propio admin
    if (db.users[idx].id === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta.' })
    }

    const deleted = db.users.splice(idx, 1)[0]
    writeDB(db)

    const { password: _pw, ...safeUser } = deleted
    res.json({ message: 'Usuario eliminado.', user: safeUser })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario.', error: err.message })
  }
})

module.exports = router
