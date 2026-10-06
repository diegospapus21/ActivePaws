// ─── Validaciones de formularios (móvil) ───────────────────────────────────────
// Cada función devuelve un mensaje de error o '' si el valor es válido.
// Se usan en registro, edición de perfil, recuperación de contraseña y checkout.

export const MIN_AGE = 13
export const MAX_AGE = 100
export const MIN_PASSWORD = 6

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-\s]{8,15}$/
const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/

export function validateRequired(value, label = 'Este campo') {
  return String(value ?? '').trim() ? '' : `${label} es obligatorio.`
}

export function validateName(name) {
  const v = String(name ?? '').trim()
  if (!v) return 'Ingresa tu nombre completo.'
  if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (!NAME_RE.test(v)) return 'El nombre solo puede contener letras y espacios.'
  return ''
}

export function validateEmail(email) {
  const v = String(email ?? '').trim()
  if (!v) return 'Ingresa tu correo electrónico.'
  return EMAIL_RE.test(v) ? '' : 'Correo electrónico inválido.'
}

export function validateUsername(username) {
  const v = String(username ?? '').trim()
  if (v.length < 3) return 'El usuario debe tener al menos 3 caracteres.'
  if (/\s/.test(v)) return 'El usuario no puede tener espacios.'
  return ''
}

/** Edad: entero, no negativa, dentro del rango permitido. */
export function validateAge(age) {
  const v = String(age ?? '').trim()
  if (!v) return 'Ingresa tu edad.'
  if (!/^\d+$/.test(v)) return 'La edad debe ser un número entero positivo.'
  const n = Number(v)
  if (n < MIN_AGE || n > MAX_AGE) return `La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años.`
  return ''
}

export function validatePhone(phone, { required = true } = {}) {
  const v = String(phone ?? '').trim()
  if (!v) return required ? 'Ingresa un número de teléfono.' : ''
  return PHONE_RE.test(v) ? '' : 'El teléfono debe tener entre 8 y 15 dígitos.'
}

export function validatePassword(password) {
  if (!password) return 'Ingresa una contraseña.'
  return password.length >= MIN_PASSWORD ? '' : `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`
}

export function validateConfirm(password, confirm) {
  return password === confirm ? '' : 'Las contraseñas no coinciden.'
}

/** Junta los errores no vacíos en un objeto { campo: mensaje }. */
export function collectErrors(map) {
  return Object.fromEntries(Object.entries(map).filter(([, msg]) => Boolean(msg)))
}
