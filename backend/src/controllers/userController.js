const bcrypt = require('bcryptjs')
const User   = require('../models/User')

// ─── GET /api/users ────────────────────────────────────────────────────────────
// Solo admin. Nunca devuelve contraseñas (toJSON las omite).
async function getUsers(req, res) {
  try {
    const { search, role, status } = req.query
    const filter = {}

    if (role)   filter.role = role
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(filter).sort({ createdAt: -1 })
    res.json(users.map(u => u.toJSON()))
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios.', error: err.message })
  }
}

// ─── GET /api/users/:id ────────────────────────────────────────────────────────
// El propio usuario o admin
async function getUserById(req, res) {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Sin permisos.' })
    }

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

    res.json(user.toJSON())
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el usuario.', error: err.message })
  }
}

// ─── POST /api/users ───────────────────────────────────────────────────────────
// Solo admin puede crear usuarios directamente
async function createUser(req, res) {
  try {
    const { name, email, username, password, role, status } = req.body

    if (!name || !email || !username) {
      return res.status(400).json({ message: 'Nombre, correo y usuario son requeridos.' })
    }

    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'Ese nombre de usuario ya existe.' })
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Ese correo ya está registrado.' })
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10)

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim(),
      username: username.trim(),
      password: hashedPassword,
      role: role || 'client',
      status: status || 'Activo',
      emailConfirmed: true, // los usuarios creados por un admin quedan confirmados
    })

    res.status(201).json({ message: 'Usuario creado correctamente.', user: newUser.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el usuario.', error: err.message })
  }
}

// ─── PUT /api/users/:id ────────────────────────────────────────────────────────
// Solo admin
async function updateUser(req, res) {
  try {
    const { name, email, username, password, role, status } = req.body

    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

    if (name !== undefined)     user.name = name.trim()
    if (email !== undefined)    user.email = email.trim()
    if (username !== undefined) user.username = username.trim()
    if (role !== undefined)     user.role = role
    if (status !== undefined)   user.status = status
    if (password) user.password = await bcrypt.hash(password, 10)

    await user.save()
    res.json({ message: 'Usuario actualizado.', user: user.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el usuario.', error: err.message })
  }
}

// ─── DELETE /api/users/:id ─────────────────────────────────────────────────────
// Solo admin
async function deleteUser(req, res) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta.' })
    }

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

    res.json({ message: 'Usuario eliminado.', user: user.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario.', error: err.message })
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser }
