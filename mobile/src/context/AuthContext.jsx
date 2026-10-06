import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, saveToken, getToken, clearToken } from '../api/client'

// ─── Contexto de autenticación (móvil) ─────────────────────────────────────────
// Guarda el JWT de forma segura (expo-secure-store) y expone el usuario actual.
// Solo la app de clientes: si el usuario fuera admin igual puede entrar, pero la
// app está pensada para el rol 'client'.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)   // cargando sesión inicial

  // Al abrir la app, si hay token guardado, recuperamos el usuario.
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken()
        if (token) {
          const res = await api.get('/auth/me')
          setUser(res.user)
        }
      } catch {
        await clearToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // ─── Iniciar sesión ───────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', { username, password }, { auth: false })
    await saveToken(res.token)
    setUser(res.user)
    return res.user
  }, [])

  // ─── Registrar cuenta (envía código de verificación al correo) ─────────────
  const register = useCallback(async (payload) => {
    // payload: { name, email, username, password, age }
    return api.post('/auth/register', payload, { auth: false })
  }, [])

  // ─── Verificar código de 6 dígitos ─────────────────────────────────────────
  const verifyCode = useCallback(async (email, code) => {
    return api.post('/auth/verify-code', { email, code }, { auth: false })
  }, [])

  const resendCode = useCallback(async (email) => {
    return api.post('/auth/resend-code', { email }, { auth: false })
  }, [])

  const forgotPassword = useCallback(async (email) => {
    return api.post('/auth/forgot-password', { email }, { auth: false })
  }, [])

  // ─── Restablecer contraseña con el código de 6 dígitos del correo ───────────
  const resetPassword = useCallback(async (email, code, password) => {
    return api.post('/auth/reset-password', { email, code, password }, { auth: false })
  }, [])

  // ─── Editar el perfil del usuario logueado ──────────────────────────────────
  // Actualiza el estado global para que Home, Perfil, etc. muestren los datos nuevos.
  const updateProfile = useCallback(async (changes) => {
    const res = await api.put('/auth/me', changes)
    setUser(res.user)
    return res
  }, [])

  // ─── Refrescar datos del usuario (ej. tras confirmar correo) ────────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.user)
      return res.user
    } catch {
      return null
    }
  }, [])

  const logout = useCallback(async () => {
    await clearToken()
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isLogged: Boolean(user),
    isConfirmed: Boolean(user?.emailConfirmed),
    isAdmin: user?.role === 'admin',
    login,
    register,
    verifyCode,
    resendCode,
    forgotPassword,
    resetPassword,
    updateProfile,
    refreshUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
