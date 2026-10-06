import { Redirect } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { Loading } from '../components'

// Ruta inicial: mientras se revisa el token guardado se muestra un cargando.
// Si la sesión ya existe → Home. Si no → Login (desde ahí se puede entrar como invitado).
export default function InitialRoute() {
  const { loading, isLogged } = useAuth()
  if (loading) return <Loading label="Iniciando ActivePaws…" />
  return <Redirect href={isLogged ? '/(tabs)' : '/(auth)/login'} />
}
