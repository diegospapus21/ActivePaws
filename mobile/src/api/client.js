// ─── Cliente HTTP central (móvil) ──────────────────────────────────────────────
// Equivalente a src/api/client.js del frontend web, adaptado a React Native.
// Adjunta el JWT guardado de forma segura (expo-secure-store) y normaliza errores.

import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { API_URL } from '../config'

const TOKEN_KEY = 'activepaws_token'

// ─── Almacenamiento del token ──────────────────────────────────────────────────
// SecureStore no está disponible en web; ahí caemos a localStorage.
export async function saveToken(token) {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(TOKEN_KEY, token)
    return
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function getToken() {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
  }
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function clearToken() {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(TOKEN_KEY)
    return
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

/**
 * apiFetch
 * @param {string} path    Ruta relativa a la API, ej: '/products'
 * @param {object} options { method, body, auth, headers }
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers }

  if (auth) {
    const token = await getToken()
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
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que la URL de la API sea la correcta.')
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
  get: (path, opts) => apiFetch(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => apiFetch(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' }),
}
