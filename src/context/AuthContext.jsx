import { createContext, useContext, useState } from 'react'

// ─── Contexto de autenticación ────────────────────────────────────────────────
// Guarda el usuario activo y expone login / logout para toda la app.

const AuthContext = createContext(null)

// Usuarios demo (en un proyecto real vendrían del backend)
const DEMO_USERS = [
  { id: 1, username: 'admin',   password: 'admin123',  role: 'admin',  name: 'Administrador' },
  { id: 2, username: 'cliente', password: 'cliente123', role: 'client', name: 'Cliente Demo'  },
]

export function AuthProvider({ children }) {
  // Intentamos recuperar la sesión guardada en localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('activepaws_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  /**
   * Intenta iniciar sesión.
   * @returns {{ ok: boolean, message: string }}
   */
  const login = (username, password) => {
    const found = DEMO_USERS.find(
      u => u.username === username && u.password === password
    )

    if (!found) {
      return { ok: false, message: 'Usuario o contraseña incorrectos.' }
    }

    // No guardamos la contraseña en el estado/storage
    const { password: _pw, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('activepaws_user', JSON.stringify(safeUser))
    return { ok: true, message: '' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('activepaws_user')
  }

  const isAdmin  = user?.role === 'admin'
  const isLogged = Boolean(user)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLogged }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook de acceso rápido
export const useAuth = () => useContext(AuthContext)
