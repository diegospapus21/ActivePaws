import { useState, useCallback } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'

import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { Button, EmptyState, Loading, OrderCard } from '../components'
import { colors, spacing } from '../theme/theme'

// Historial de compras del usuario. Toca un pedido para ver su detalle.
export default function OrdersScreen() {
  const router = useRouter()
  const { isLogged } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isLogged) { setOrders([]); setLoading(false); return }   // sin sesión: no dejar pedidos de otro usuario
    try {
      setError('')
      const data = await api.get('/orders/mine')
      setOrders(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar tus pedidos.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [isLogged])

  // Recargar cada vez que la pestaña recibe foco (ej. tras una compra)
  useFocusEffect(useCallback(() => { setLoading(true); load() }, [load]))

  if (!isLogged) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="lock-closed-outline"
          title="Inicia sesión"
          subtitle="Necesitas una cuenta para ver el historial de tus pedidos."
          action={<Button title="Iniciar sesión" icon="log-in-outline" onPress={() => router.push('/(auth)/login')} />}
        />
      </View>
    )
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <View style={styles.container}>
        <EmptyState icon="cloud-offline-outline" title="Error de conexión" subtitle={error}
          action={<Button title="Reintentar" onPress={() => { setLoading(true); load() }} />} />
      </View>
    )
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="receipt-outline"
          title="Aún no tienes pedidos"
          subtitle="Cuando realices tu primera compra aparecerá aquí."
          action={<Button title="Explorar catálogo" icon="grid-outline" onPress={() => router.push('/(tabs)/products')} />}
        />
      </View>
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={orders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} tintColor={colors.paw[500]} />}
      renderItem={({ item }) => (
        <OrderCard order={item} onPress={() => router.push(`/order/${item.id}`)} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
})
