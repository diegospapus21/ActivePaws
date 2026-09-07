// ─── Cliente HTTP central ──────────────────────────────────────────────────────
// Centraliza las llamadas al backend: arma la URL base, adjunta el token JWT
// guardado en localStorage y normaliza el manejo de errores.

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('activepaws_token')
}

/**
 * apiFetch
 * @param {string} path   - Ruta relativa a la API, ej: '/products'
 * @param {object} options - { method, body, auth }
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers }

  if (auth) {
    const token = getToken()
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.message || `Error ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get:    (path, opts)       => apiFetch(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body }),
  put:    (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body }),
  del:    (path, opts)       => apiFetch(path, { ...opts, method: 'DELETE' }),
}
