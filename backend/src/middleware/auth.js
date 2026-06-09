const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'activepaws_secret_key_2024'

/**
 * verifyToken
 * ────────────
 * Middleware que verifica el JWT enviado en el header Authorization.
 * Si el token es válido, adjunta el usuario decodificado en req.user.
 *
 * Uso: router.get('/ruta', verifyToken, handler)
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
 * Middleware que verifica que el usuario autenticado sea administrador.
 * Siempre se usa DESPUÉS de verifyToken.
 *
 * Uso: router.delete('/ruta', verifyToken, verifyAdmin, handler)
 */
function verifyAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' })
  }
  next()
}

module.exports = { verifyToken, verifyAdmin, JWT_SECRET }
