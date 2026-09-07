import { Redirect } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'
import { Loading } from '../src/components/ui'

// Punto de entrada. El carrito y el catálogo son públicos, así que siempre
// entramos a las pestañas; las pantallas protegidas (carrito/checkout, pedidos,
// perfil) piden sesión por su cuenta.
export default function Index() {
  const { loading } = useAuth()
  if (loading) return <Loading label="Iniciando ActivePaws…" />
  return <Redirect href="/(tabs)" />
}
