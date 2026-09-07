import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * PrivateRoute
 *
 * Envuelve rutas que sólo deben verse si hay sesión activa.
 *
 * Uso en App.jsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/admin" element={<Dashboard />} />
 *   </Route>
 *
 * Si además quieres restringir por rol de admin:
 *   <Route element={<PrivateRoute adminOnly />}>
 *     ...
 *   </Route>
 */
export default function PrivateRoute({ adminOnly = false }) {
  const { isLogged, isAdmin } = useAuth()

  // No hay sesión/redirige al login
  if (!isLogged) {
    return <Navigate to="/login" replace />
  }

  // Ruta solo para admins y el usuario no lo es → redirige al inicio
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  // Todo bien / renderiza la ruta hija
  return <Outlet />
}
