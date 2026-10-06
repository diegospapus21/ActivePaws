import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import QuantitySelector from './QuantitySelector'
import { colors, radii, spacing, shadow } from '../theme/theme'
import { formatPrice } from '../utils/format'

// Fila de un producto dentro del carrito (cantidad limitada al stock disponible).
export default function CartItem({ item, onChangeQuantity, onRemove }) {
  const atMax = item.quantity >= item.stock
  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.thumb} contentFit="cover" />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text>
        <View style={{ marginTop: 8 }}>
          <QuantitySelector
            size="sm"
            value={item.quantity}
            min={1}
            max={item.stock}
            onChange={(q) => onChangeQuantity(item.id, q)}
          />
        </View>
        {atMax && <Text style={styles.stockNote}>Máximo disponible: {item.stock}</Text>}
      </View>
      <View style={styles.rightCol}>
        <Pressable onPress={() => onRemove(item.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Pressable>
        <Text style={styles.lineTotal}>{formatPrice(item.price * item.quantity, item.currency)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', gap: spacing.md, backgroundColor: colors.white,
    borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card,
  },
  thumb: { width: 70, height: 70, borderRadius: radii.md, backgroundColor: colors.cream[100] },
  name: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  price: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
  stockNote: { fontSize: 11, color: colors.warning, fontWeight: '700', marginTop: 4 },
  rightCol: { justifyContent: 'space-between', alignItems: 'flex-end' },
  lineTotal: { fontSize: 14, fontWeight: '900', color: colors.bark[800] },
})
