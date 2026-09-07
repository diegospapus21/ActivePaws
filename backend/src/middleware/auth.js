const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'activepaws_secret_key_2024'

/**
 * verifyToken
 * ────────────
 * Middleware que verifica el JWT enviado en el header Authorization.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded   // { id, username, role }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' })
  }
}

/**
 * verifyAdmin
 * ────────────
 * Requiere que el usuario autenticado sea administrador. Usar después de verifyToken.
 */
function verifyAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' })
  }
  next()
}

/**
 * verifyConfirmed
 * ────────────────
 * Requiere que el usuario tenga el correo confirmado (consulta MongoDB para
 * obtener el estado más reciente). Usar después de verifyToken.
 */
async function verifyConfirmed(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })
    if (!user.emailConfirmed) {
      return res.status(403).json({ message: 'Debes confirmar tu correo electrónico antes de continuar.' })
    }
    next()
  } catch (err) {
    res.status(500).json({ message: 'Error al validar el usuario.', error: err.message })
  }
}

module.exports = { verifyToken, verifyAdmin, verifyConfirmed, JWT_SECRET }
