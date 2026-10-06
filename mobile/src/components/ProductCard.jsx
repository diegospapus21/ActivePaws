import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import Stars from './Stars'
import { colors, radii, shadow } from '../theme/theme'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'

// Tarjeta de producto para la cuadrícula del catálogo (muestra valoración y stock).
export default function ProductCard({ product }) {
  const router = useRouter()
  const { addItem, quantityOf } = useCart()
  const inCart = quantityOf(product.id)
  const outOfStock = product.stock <= 0
  const maxReached = !outOfStock && inCart >= product.stock

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }] }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: product.image }} style={styles.img} contentFit="cover" transition={200} />
        {outOfStock && (
          <View style={styles.soldOut}>
            <Text style={styles.soldOutText}>Agotado</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <View style={styles.ratingRow}>
          <Stars value={product.avgRating || 0} size={12} />
          <Text style={styles.ratingText}>({product.reviewCount || 0})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.price}>{formatPrice(product.price, product.currency)}</Text>
          <Pressable
            disabled={outOfStock || maxReached}
            onPress={() => addItem(product, 1)}
            style={[styles.addBtn, (outOfStock || maxReached) && { opacity: 0.4 }]}
            hitSlop={6}
          >
            <Ionicons name={maxReached ? 'checkmark' : 'add'} size={20} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: colors.white, borderRadius: radii.xl, borderWidth: 1,
    borderColor: colors.cream[200], overflow: 'hidden', ...shadow.card,
  },
  imgWrap: { width: '100%', aspectRatio: 1, backgroundColor: colors.cream[100] },
  img: { width: '100%', height: '100%' },
  soldOut: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: colors.error, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.pill,
  },
  soldOutText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  body: { padding: 12 },
  category: { fontSize: 11, color: colors.paw[600], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  name: { fontSize: 15, fontWeight: '800', color: colors.bark[700], marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 11, color: colors.bark[400], fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  price: { fontSize: 15, fontWeight: '800', color: colors.bark[800] },
  addBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.paw[500],
    alignItems: 'center', justifyContent: 'center',
  },
})
