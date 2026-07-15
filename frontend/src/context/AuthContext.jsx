import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'

// ─── Contexto de autenticación ────────────────────────────────────────────────
// Habla con el backend real (JWT). Guarda el token y el usuario en
// localStorage para persistir la sesión entre recargas.

const AuthContext = createContext(null)

const TOKEN_KEY = 'activepaws_token'
const USER_KEY  = 'activepaws_user'

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  // Al montar, validamos el token contra el backend (por si expiró o el
  // usuario fue desactivado/editado desde el panel admin).
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }

    api.get('/auth/me')
      .then(({ user: freshUser }) => {
        setUser(freshUser)
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  /**
   * @returns {Promise<{ ok: boolean, message: string, user?: object, reason?: string, email?: string }>}
   */
  const login = async (username, password) => {
    try {
      const { token, user: loggedUser } = await api.post('/auth/login', { username, password }, { auth: false })
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser))
      setUser(loggedUser)
      return { ok: true, message: '', user: loggedUser }
    } catch (err) {
      if (err.data?.code === 'EMAIL_NOT_VERIFIED') {
        return { ok: false, message: err.message, reason: 'unverified', email: err.data.email }
      }
      return { ok: false, message: err.message || 'Usuario o contraseña incorrectos.' }
    }
  }

  /**
   * @returns {Promise<{ ok: boolean, message: string, email?: string, emailSent?: boolean }>}
   */
  const register = async ({ name, email, username, password }) => {
    try {
      const res = await api.post('/auth/register', { name, email, username, password }, { auth: false })
      return { ok: true, message: res.message, email: res.email, emailSent: res.emailSent }
    } catch (err) {
      return { ok: false, message: err.message || 'No se pudo crear la cuenta.' }
    }
  }

  /**
   * @returns {Promise<{ ok: boolean, message: string }>}
   */
  const verifyCode = async (email, code) => {
    try {
      const res = await api.post('/auth/verify-code', { email, code }, { auth: false })
      return { ok: true, message: res.message }
    } catch (err) {
      return { ok: false, message: err.message || 'No se pudo verificar el código.' }
    }
  }

  /**
   * @returns {Promise<{ ok: boolean, message: string, emailSent?: boolean }>}
   */
  const resendCode = async (email) => {
    try {
      const res = await api.post('/auth/resend-code', { email }, { auth: false })
      return { ok: true, message: res.message, emailSent: res.emailSent }
    } catch (err) {
      return { ok: false, message: err.message || 'No se pudo reenviar el código.' }
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const refreshMe = async () => {
    try {
      const { user: freshUser } = await api.get('/auth/me')
      setUser(freshUser)
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
      return freshUser
    } catch {
      return null
    }
  }

  const isAdmin     = user?.role === 'admin'
  const isLogged    = Boolean(user)
  const isConfirmed = Boolean(user?.emailConfirmed)

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, refreshMe, verifyCode, resendCode,
      isAdmin, isLogged, isConfirmed,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de acceso rápido
export const useAuth = () => useContext(AuthContext)
