import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import StatusBadge from './StatusBadge'
import { colors, radii, spacing, shadow } from '../theme/theme'
import { formatPrice } from '../utils/format'

// Resumen de un pedido en el historial de compras.
export default function OrderCard({ order, onPress }) {
  const count = order.items?.length || 0
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.99 }] }]} onPress={onPress}>
      <View style={styles.top}>
        <View>
          <Text style={styles.orderNo}>Pedido #{order.orderNumber}</Text>
          <Text style={styles.date}>{order.date}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>
      <View style={styles.divider} />
      <View style={styles.bottom}>
        <Text style={styles.items}>{count} {count === 1 ? 'artículo' : 'artículos'}</Text>
        <View style={styles.totalWrap}>
          <Text style={styles.total}>{formatPrice(order.total, order.currency)}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.bark[300]} />
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderNo: { fontSize: 16, fontWeight: '900', color: colors.bark[800] },
  date: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.cream[200], marginVertical: spacing.md },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  items: { fontSize: 13, color: colors.bark[500], fontWeight: '600' },
  totalWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  total: { fontSize: 16, fontWeight: '900', color: colors.bark[800] },
})
