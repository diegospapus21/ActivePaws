import { useState, useEffect, useCallback } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'

import { api } from '../api/client'
import { useToast } from '../context/ToastContext'
import { Button, EmptyState, InfoLine, Loading, OrderTracker, SectionTitle, StatusBadge } from '../components'
import { colors, radii, spacing, shadow } from '../theme/theme'
import { formatPrice } from '../utils/format'

// Detalle de un pedido del historial. Si sigue "Pendiente" el cliente puede
// cancelarlo y el stock de los productos vuelve a estar disponible.
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams()
  const { showToast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await api.get(`/orders/${id}`)
      setOrder(data)
    } catch (err) {
      showToast(err.message || 'No se pudo cargar el pedido.', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, showToast])

  useEffect(() => { load() }, [load])

  const cancelOrder = async () => {
    setCancelling(true)
    try {
      const res = await api.put(`/orders/${id}/cancel`)
      setOrder(res.order)
      showToast(res.message || 'Pedido cancelado.', 'success')
    } catch (err) {
      showToast(err.message || 'No se pudo cancelar el pedido.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const confirmCancel = () => {
    Alert.alert(
      'Cancelar pedido',
      '¿Seguro que quieres cancelar este pedido? Los productos volverán a estar disponibles en la tienda.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, cancelar', style: 'destructive', onPress: cancelOrder },
      ]
    )
  }

  if (loading) return <Loading />
  if (!order) return <EmptyState icon="alert-circle-outline" title="Pedido no encontrado" />

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      <Stack.Screen options={{ title: `Pedido #${order.orderNumber}` }} />

      {/* Encabezado */}
      <View style={styles.card}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.orderNo}>Pedido #{order.orderNumber}</Text>
            <Text style={styles.date}>Realizado el {order.date}</Text>
          </View>
          <StatusBadge status={order.status} />
        </View>
        <OrderTracker status={order.status} />
      </View>

      {/* Artículos */}
      <SectionTitle style={styles.section}>Artículos</SectionTitle>
      <View style={styles.card}>
        {order.items?.length ? order.items.map((it, idx) => (
          <View key={idx} style={[styles.item, idx > 0 && styles.itemBorder]}>
            <View style={styles.itemQty}>
              <Text style={styles.itemQtyText}>{it.qty}×</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName} numberOfLines={2}>{it.name}</Text>
              <Text style={styles.itemUnit}>{formatPrice(it.price, order.currency)} c/u</Text>
            </View>
            <Text style={styles.itemPrice}>{formatPrice(it.price * it.qty, order.currency)}</Text>
          </View>
        )) : (
          <Text style={styles.muted}>Sin artículos registrados.</Text>
        )}
      </View>

      {/* Envío */}
      {order.shipping && (
        <>
          <SectionTitle style={styles.section}>Envío</SectionTitle>
          <View style={styles.card}>
            {order.shipping.name ? <InfoLine icon="person-outline" text={order.shipping.name} /> : null}
            {order.shipping.address ? <InfoLine icon="location-outline" text={order.shipping.address} /> : null}
            {order.shipping.city ? <InfoLine icon="business-outline" text={order.shipping.city} /> : null}
            {order.shipping.phone ? <InfoLine icon="call-outline" text={order.shipping.phone} /> : null}
          </View>
        </>
      )}

      {/* Total */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>{order.status === 'Cancelado' ? 'Total (cancelado)' : 'Total del pedido'}</Text>
        <Text style={styles.totalValue}>{formatPrice(order.total, order.currency)}</Text>
      </View>

      {order.status === 'Pendiente' && (
        <Button
          title="Cancelar pedido"
          variant="danger"
          icon="close-circle-outline"
          onPress={confirmCancel}
          loading={cancelling}
          style={{ marginTop: spacing.lg }}
        />
      )}
      {order.status === 'Entregado' && (
        <Text style={styles.hint}>¿Te gustó? Entra a cada producto desde el catálogo para dejar tu reseña.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNo: { fontSize: 18, fontWeight: '900', color: colors.bark[800] },
  date: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
  section: { marginTop: spacing.xl },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.cream[200] },
  itemQty: { backgroundColor: colors.paw[50], borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 4 },
  itemQtyText: { color: colors.paw[700], fontWeight: '800', fontSize: 13 },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.bark[700] },
  itemUnit: { fontSize: 12, color: colors.bark[400], marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '800', color: colors.bark[800] },
  muted: { color: colors.bark[400], padding: 8 },
  totalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.bark[700], borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.xl,
  },
  totalLabel: { color: colors.cream[200], fontSize: 15, fontWeight: '700' },
  totalValue: { color: colors.white, fontSize: 22, fontWeight: '900' },
  hint: { fontSize: 13, color: colors.bark[400], textAlign: 'center', marginTop: spacing.lg },
})
