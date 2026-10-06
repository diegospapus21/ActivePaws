import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'

import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { ToastProvider } from '../context/ToastContext'
import { colors } from '../theme/theme'

SplashScreen.preventAutoHideAsync().catch(() => {})

// Navegador raíz: envuelve la app con los proveedores de estado global
// (Toast → Auth → Cart) y define la pila principal de pantallas.
export default function RootNavigator() {
  useEffect(() => {
    // Ocultamos el splash una vez montado el árbol de proveedores.
    SplashScreen.hideAsync().catch(() => {})
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <StatusBar style="dark" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.cream[50] },
                  headerTintColor: colors.bark[700],
                  headerTitleStyle: { fontWeight: '800' },
                  contentStyle: { backgroundColor: colors.cream[50] },
                  headerShadowVisible: false,
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="product/[id]" options={{ title: 'Producto', presentation: 'card' }} />
                <Stack.Screen name="order/[id]" options={{ title: 'Detalle del pedido' }} />
                <Stack.Screen name="checkout" options={{ title: 'Finalizar compra' }} />
                <Stack.Screen name="edit-profile" options={{ title: 'Editar perfil' }} />
              </Stack>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
