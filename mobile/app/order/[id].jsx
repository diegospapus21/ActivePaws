import { useState, useEffect, useCallback } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, Stack } from 'expo-router'

import { api } from '../../src/api/client'
import { useToast } from '../../src/context/ToastContext'
import { StatusBadge, Loading, EmptyState } from '../../src/components/ui'
import { colors, radii, spacing, shadow } from '../../src/theme/theme'
import { formatPrice } from '../../src/utils/format'

const STEPS = ['Pendiente', 'Enviado', 'Entregado']

export default function OrderDetail() {
  const { id } = useLocalSearchParams()
  const { showToast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <Loading />
  if (!order) return <EmptyState icon="alert-circle-outline" title="Pedido no encontrado" />

  const cancelled = order.status === 'Cancelado'
  const currentStep = STEPS.indexOf(order.status)

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      <Stack.Screen options={{ title: `Pedido #${order.orderNumber}` }} />

      {/* Encabezado */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.orderNo}>Pedido #{order.orderNumber}</Text>
            <Text style={styles.date}>Realizado el {order.date}</Text>
          </View>
          <StatusBadge status={order.status} />
        </View>

        {/* Línea de progreso */}
        {!cancelled ? (
          <View style={styles.tracker}>
            {STEPS.map((step, i) => {
              const done = i <= currentStep
              return (
                <View key={step} style={styles.trackerStep}>
                  <View style={styles.trackerLineWrap}>
                    {i > 0 && <View style={[styles.trackerLine, i <= currentStep && styles.trackerLineDone]} />}
                    <View style={[styles.trackerDot, done && styles.trackerDotDone]}>
                      {done && <Ionicons name="checkmark" size={12} color={colors.white} />}
                    </View>
                    {i < STEPS.length - 1 && <View style={[styles.trackerLine, i < currentStep && styles.trackerLineDone]} />}
                  </View>
                  <Text style={[styles.trackerLabel, done && styles.trackerLabelDone]}>{step}</Text>
                </View>
              )
            })}
          </View>
        ) : (
          <View style={styles.cancelledBanner}>
            <Ionicons name="close-circle-outline" size={18} color={colors.error} />
            <Text style={styles.cancelledText}>Este pedido fue cancelado.</Text>
          </View>
        )}
      </View>

      {/* Artículos */}
      <Text style={styles.sectionTitle}>Artículos</Text>
      <View style={styles.card}>
        {order.items?.length ? order.items.map((it, idx) => (
          <View key={idx} style={[styles.item, idx > 0 && styles.itemBorder]}>
            <View style={styles.itemQty}>
              <Text style={styles.itemQtyText}>{it.qty}×</Text>
            </View>
            <Text style={styles.itemName} numberOfLines={2}>{it.name}</Text>
            <Text style={styles.itemPrice}>{formatPrice(it.price * it.qty, order.currency)}</Text>
          </View>
        )) : (
          <Text style={styles.muted}>Sin artículos registrados.</Text>
        )}
      </View>

      {/* Envío */}
      {order.shipping && (
        <>
          <Text style={styles.sectionTitle}>Envío</Text>
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
        <Text style={styles.totalLabel}>Total pagado</Text>
        <Text style={styles.totalValue}>{formatPrice(order.total, order.currency)}</Text>
      </View>
    </ScrollView>
  )
}

function InfoLine({ icon, text }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={16} color={colors.bark[400]} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  headerCard: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNo: { fontSize: 18, fontWeight: '900', color: colors.bark[800] },
  date: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
  tracker: { flexDirection: 'row', marginTop: spacing.xl },
  trackerStep: { flex: 1, alignItems: 'center' },
  trackerLineWrap: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  trackerLine: { flex: 1, height: 3, backgroundColor: colors.cream[300] },
  trackerLineDone: { backgroundColor: colors.paw[400] },
  trackerDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.cream[300], alignItems: 'center', justifyContent: 'center' },
  trackerDotDone: { backgroundColor: colors.paw[500] },
  trackerLabel: { fontSize: 12, color: colors.bark[400], marginTop: 6, fontWeight: '600' },
  trackerLabelDone: { color: colors.bark[700], fontWeight: '800' },
  cancelledBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.lg, backgroundColor: colors.status.cancelledBg, padding: 10, borderRadius: radii.md },
  cancelledText: { color: colors.error, fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.bark[800], marginTop: spacing.xl, marginBottom: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.cream[200] },
  itemQty: { backgroundColor: colors.paw[50], borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 4 },
  itemQtyText: { color: colors.paw[700], fontWeight: '800', fontSize: 13 },
  itemName: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.bark[700] },
  itemPrice: { fontSize: 14, fontWeight: '800', color: colors.bark[800] },
  muted: { color: colors.bark[400], padding: 8 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  infoText: { fontSize: 14, color: colors.bark[600], flex: 1 },
  totalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.bark[700], borderRadius: radii.lg, padding: spacing.lg, marginTop: spacing.xl,
  },
  totalLabel: { color: colors.cream[200], fontSize: 15, fontWeight: '700' },
  totalValue: { color: colors.white, fontSize: 22, fontWeight: '900' },
})
