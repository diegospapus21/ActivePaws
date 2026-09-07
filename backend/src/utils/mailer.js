// ─── Servicio de correo (envío real vía SMTP con Nodemailer) ──────────────────
// Configura las variables SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y
// EMAIL_FROM en tu .env para que los correos se envíen de verdad (por ejemplo
// con una cuenta de Gmail + "contraseña de aplicación", o cualquier proveedor
// SMTP como SendGrid, Mailtrap, Resend, etc.).
//
// Si esas variables no están configuradas, el servicio cae automáticamente a
// un modo de "simulación" (imprime el correo en la consola) para que el
// proyecto siga siendo ejecutable sin credenciales reales — pero en cuanto
// configures el .env, los correos se enviarán de verdad sin tocar el código.

const nodemailer = require('nodemailer')

const isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

let transporter = null
if (isConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true para el puerto 465, false para 587/25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

async function sendMail({ to, subject, html, text }) {
  if (!isConfigured) {
    console.log('\n⚠️  SMTP no configurado — el correo se muestra aquí en lugar de enviarse.')
    console.log('📧 ── Correo (modo simulación) ──────────────────────────────')
    console.log(`   Para:    ${to}`)
    console.log(`   Asunto:  ${subject}`)
    console.log(`   ${text || html}`)
    console.log('   ─────────────────────────────────────────────────────────')
    console.log('   Configura SMTP_HOST / SMTP_USER / SMTP_PASS en backend/.env para enviarlo de verdad.\n')
    return { ok: true, sent: false }
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    })
    console.log(`📧 Correo enviado a ${to}: "${subject}"`)
    return { ok: true, sent: true }
  } catch (err) {
    console.error('❌ Error al enviar el correo:', err.message)
    return { ok: false, sent: false, error: err.message }
  }
}

// Genera un código numérico de 6 dígitos
function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function sendVerificationCodeEmail(user, code) {
  return sendMail({
    to: user.email,
    subject: 'Tu código de verificación de ActivePaws',
    text: `Hola ${user.name}, tu código de verificación es: ${code}. Vence en 15 minutos.`,
    html: `
      <div style="font-family: sans-serif; max-width: 420px; margin: auto;">
        <h2 style="color:#c9891a;">🐾 ActivePaws</h2>
        <p>Hola <b>${user.name}</b>, gracias por registrarte.</p>
        <p>Tu código de verificación es:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color:#8c6448;">${code}</p>
        <p style="font-size: 13px; color:#888;">Este código vence en 15 minutos. Si tú no solicitaste esta cuenta, ignora este correo.</p>
      </div>
    `,
  })
}

function sendPasswordResetEmail(user, token) {
  const base = process.env.FRONTEND_URL || 'http://localhost:5173'
  const link = `${base}/restablecer/${token}`
  return sendMail({
    to: user.email,
    subject: 'Recupera tu contraseña de ActivePaws',
    text: `Hola ${user.name}, para restablecer tu contraseña visita: ${link}`,
    html: `<p>Hola ${user.name}, para restablecer tu contraseña haz clic aquí:</p><a href="${link}">${link}</a>`,
  })
}

module.exports = { sendMail, generateCode, sendVerificationCodeEmail, sendPasswordResetEmail, isConfigured }
