const crypto  = require('crypto')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')
const { JWT_SECRET } = require('../middleware/auth')
const { generateCode, sendVerificationCodeEmail, sendPasswordResetEmail, isConfigured } = require('../utils/mailer')

const CODE_TTL_MS = 15 * 60 * 1000 // 15 minutos

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
async function login(req, res) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' })
    }

    const user = await User.findOne({ username })
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

    if (!user.emailConfirmed) {
      return res.status(403).json({
        message: 'Debes verificar tu correo electrónico antes de iniciar sesión.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email,
      })
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ token, user: user.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message })
  }
}

// ─── POST /api/auth/register ───────────────────────────────────────────────────
// Crea la cuenta (inactiva hasta verificar) y envía un código de 6 dígitos al
// correo del cliente. La cuenta no permite iniciar sesión hasta que el código
// sea verificado con POST /api/auth/verify-code.
async function register(req, res) {
  try {
    const { name, email, username, password } = req.body

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos.' })
    }

    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'Ese nombre de usuario ya está en uso.' })
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Ese correo ya está registrado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const code = generateCode()

    const newUser = await User.create({
      name, email, username,
      password: hashedPassword,
      role: 'client',
      status: 'Activo',
      emailConfirmed: false,
      confirmCode: code,
      confirmCodeExpires: new Date(Date.now() + CODE_TTL_MS),
    })

    const mail = await sendVerificationCodeEmail(newUser, code)

    res.status(201).json({
      message: mail.sent
        ? `Te enviamos un código de verificación a ${newUser.email}.`
        : `No se pudo enviar el correo real (SMTP no configurado). Revisa la consola del backend para ver el código.`,
      email: newUser.email,
      emailSent: mail.sent,
    })
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message })
  }
}

// ─── POST /api/auth/verify-code ────────────────────────────────────────────────
// Verifica el código de 6 dígitos enviado al correo. Una vez verificado, el
// usuario ya puede iniciar sesión.
async function verifyCode(req, res) {
  try {
    const { email, code } = req.body
    if (!email || !code) {
      return res.status(400).json({ message: 'Correo y código son requeridos.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: 'No existe una cuenta con ese correo.' })

    if (user.emailConfirmed) {
      return res.status(400).json({ message: 'Esta cuenta ya fue verificada. Ya puedes iniciar sesión.' })
    }

    if (!user.confirmCode || !user.confirmCodeExpires || user.confirmCodeExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'El código expiró. Solicita uno nuevo.', code: 'CODE_EXPIRED' })
    }

    if (String(code).trim() !== user.confirmCode) {
      return res.status(400).json({ message: 'Código incorrecto.', code: 'CODE_INVALID' })
    }

    user.emailConfirmed = true
    user.confirmCode = null
    user.confirmCodeExpires = null
    await user.save()

    res.json({ message: '¡Cuenta verificada correctamente! Ya puedes iniciar sesión.', user: user.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar el código.', error: err.message })
  }
}

// ─── POST /api/auth/resend-code ────────────────────────────────────────────────
async function resendCode(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'El correo es requerido.' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: 'No existe una cuenta con ese correo.' })
    if (user.emailConfirmed) return res.status(400).json({ message: 'Esa cuenta ya está verificada.' })

    user.confirmCode = generateCode()
    user.confirmCodeExpires = new Date(Date.now() + CODE_TTL_MS)
    await user.save()

    const mail = await sendVerificationCodeEmail(user, user.confirmCode)

    res.json({
      message: mail.sent
        ? `Reenviamos el código a ${user.email}.`
        : `No se pudo enviar el correo real (SMTP no configurado). Revisa la consola del backend.`,
      emailSent: mail.sent,
    })
  } catch (err) {
    res.status(500).json({ message: 'Error al reenviar el código.', error: err.message })
  }
}

// ─── POST /api/auth/forgot-password ────────────────────────────────────────────
async function forgotPassword(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'El correo es requerido.' })

    const user = await User.findOne({ email: email.toLowerCase().trim() })

    // Por seguridad respondemos igual exista o no el correo.
    if (!user) {
      return res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' })
    }

    user.resetToken = crypto.randomBytes(24).toString('hex')
    user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutos
    await user.save()

    await sendPasswordResetEmail(user, user.resetToken)

    res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación.' })
  } catch (err) {
    res.status(500).json({ message: 'Error al procesar la solicitud.', error: err.message })
  }
}

// ─── POST /api/auth/reset-password ─────────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body
    if (!token || !password) {
      return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' })
    }

    const user = await User.findOne({ resetToken: token })

    if (!user || !user.resetTokenExpires || user.resetTokenExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: 'El enlace de recuperación es inválido o ha expirado.' })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetToken = null
    user.resetTokenExpires = null
    await user.save()

    res.json({ message: 'Tu contraseña ha sido restablecida correctamente.' })
  } catch (err) {
    res.status(500).json({ message: 'Error al restablecer la contraseña.', error: err.message })
  }
}

// ─── GET /api/auth/me ───────────────────────────────────────────────────────────
async function me(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })
    res.json({ user: user.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el usuario.', error: err.message })
  }
}

// ─── GET /api/auth/mail-status ─────────────────────────────────────────────────
function mailStatus(req, res) {
  res.json({ configured: isConfigured })
}

module.exports = { login, register, verifyCode, resendCode, forgotPassword, resetPassword, me, mailStatus }
