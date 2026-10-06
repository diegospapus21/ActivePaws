import { Stack } from 'expo-router'
import { colors } from '../theme/theme'

// Pila de pantallas de autenticación (login, registro, verificación, recuperación).
export default function AuthNavigator() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream[50] },
        headerTintColor: colors.bark[700],
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cream[50] },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />
      <Stack.Screen name="verify" options={{ title: 'Verificar correo' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Recuperar contraseña' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Nueva contraseña' }} />
    </Stack>
  )
}
