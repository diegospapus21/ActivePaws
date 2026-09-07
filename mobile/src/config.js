import Constants from 'expo-constants'
import { Platform } from 'react-native'

// ─── Resolución de la URL base de la API ───────────────────────────────────────
// El backend corre en http://TU_MAQUINA:4000/api.
//
//  • En un emulador de Android, "localhost" apunta al propio emulador, así que se
//    usa la IP especial 10.0.2.2 para llegar a la máquina anfitriona.
//  • En un dispositivo físico (Expo Go), "localhost" apunta al teléfono, por lo
//    que DEBES usar la IP de tu computadora en la red local (ej. 192.168.1.20).
//    Configúrala en app.json -> expo.extra.apiUrl o en la variable de entorno
//    EXPO_PUBLIC_API_URL antes de iniciar (`npx expo start`).
//
// Orden de prioridad:
//   1. EXPO_PUBLIC_API_URL  (variable de entorno)
//   2. expo.extra.apiUrl    (app.json)
//   3. Valor por defecto según la plataforma

function resolveApiUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL
  if (fromEnv) return fromEnv

  const fromExtra = Constants.expoConfig?.extra?.apiUrl
  if (fromExtra) return fromExtra

  if (Platform.OS === 'android') return 'http://10.0.2.2:4000/api'
  return 'http://localhost:4000/api'
}

export const API_URL = resolveApiUrl()

// Categorías disponibles (coinciden con las del seed del backend)
export const CATEGORIES = ['Ropa para Perros', 'Ropa para Gatos', 'Accesorios']

// Estados de pedido válidos (coinciden con el enum del modelo Order)
export const ORDER_STATUSES = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado']

export const CURRENCY = 'MXN'
