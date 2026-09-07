import { useState, useCallback } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useFocusEffect } from 'expo-router'

import { api } from '../../src/api/client'
import { useAuth } from '../../src/context/AuthContext'
import { StatusBadge, EmptyState, Loading, Button } from '../../src/components/ui'
import { colors, radii, spacing, shadow } from '../../src/theme/theme'
import { formatPrice } from '../../src/utils/format'

export default function Orders() {
  const router = useRouter()
  const { isLogged } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isLogged) { setLoading(false); return }
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
        <Pressable
          style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.99 }] }]}
          onPress={() => router.push(`/order/${item.id}`)}
        >
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.orderNo}>Pedido #{item.orderNumber}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <StatusBadge status={item.status} />
          </View>
          <View style={styles.divider} />
          <View style={styles.cardBottom}>
            <Text style={styles.items}>
              {item.items?.length || 0} {item.items?.length === 1 ? 'artículo' : 'artículos'}
            </Text>
            <View style={styles.totalWrap}>
              <Text style={styles.total}>{formatPrice(item.total, item.currency)}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.bark[300]} />
            </View>
          </View>
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  card: {
    backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.cream[200], ...shadow.card,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNo: { fontSize: 16, fontWeight: '900', color: colors.bark[800] },
  date: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.cream[200], marginVertical: spacing.md },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  items: { fontSize: 13, color: colors.bark[500], fontWeight: '600' },
  totalWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  total: { fontSize: 16, fontWeight: '900', color: colors.bark[800] },
})
