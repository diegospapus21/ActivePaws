import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useCart } from '../../src/context/CartContext'
import { useAuth } from '../../src/context/AuthContext'
import { Button, EmptyState } from '../../src/components/ui'
import { colors, radii, spacing, shadow } from '../../src/theme/theme'
import { formatPrice } from '../../src/utils/format'

export default function Cart() {
  const router = useRouter()
  const { cart, total, updateQuantity, removeItem } = useCart()
  const { isLogged, isConfirmed } = useAuth()

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Tu carrito está vacío"
          subtitle="Agrega productos desde el catálogo para comenzar tu compra."
          action={<Button title="Ir al catálogo" icon="grid-outline" onPress={() => router.push('/(tabs)/products')} />}
        />
      </View>
    )
  }

  const goCheckout = () => {
    if (!isLogged) {
      router.push('/(auth)/login')
      return
    }
    router.push('/checkout')
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.thumb} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.price}>{formatPrice(item.price, item.currency)}</Text>
              <View style={styles.qtyRow}>
                <Pressable onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn} hitSlop={6}>
                  <Ionicons name="remove" size={16} color={colors.bark[600]} />
                </Pressable>
                <Text style={styles.qty}>{item.quantity}</Text>
                <Pressable onPress={() => updateQuantity(item.id, +1)} style={styles.qtyBtn} hitSlop={6}>
                  <Ionicons name="add" size={16} color={colors.bark[600]} />
                </Pressable>
              </View>
            </View>
            <View style={styles.rightCol}>
              <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </Pressable>
              <Text style={styles.lineTotal}>{formatPrice(item.price * item.quantity, item.currency)}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        {!isConfirmed && isLogged && (
          <View style={styles.warn}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
            <Text style={styles.warnText}>Confirma tu correo para poder comprar.</Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
        <Button
          title={isLogged ? 'Finalizar compra' : 'Inicia sesión para comprar'}
          icon={isLogged ? 'bag-check-outline' : 'log-in-outline'}
          onPress={goCheckout}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  row: {
    flexDirection: 'row', gap: spacing.md, backgroundColor: colors.white,
    borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card,
  },
  thumb: { width: 70, height: 70, borderRadius: radii.md, backgroundColor: colors.cream[100] },
  name: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  price: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.cream[100],
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.cream[300],
  },
  qty: { fontSize: 15, fontWeight: '800', color: colors.bark[700], minWidth: 20, textAlign: 'center' },
  rightCol: { justifyContent: 'space-between', alignItems: 'flex-end' },
  lineTotal: { fontSize: 14, fontWeight: '900', color: colors.bark[800] },
  footer: {
    backgroundColor: colors.white, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cream[200],
    ...shadow.floating,
  },
  warn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  warnText: { color: colors.warning, fontSize: 13, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.bark[500] },
  totalValue: { fontSize: 22, fontWeight: '900', color: colors.bark[800] },
})
