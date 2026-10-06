import { useCallback, useRef } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Button, CartItem, EmptyState } from '../components'
import { colors, spacing, shadow } from '../theme/theme'
import { formatPrice } from '../utils/format'

// Carrito: modificar cantidades (1..stock), quitar productos y pasar al pago.
// Si está vacío se muestra un aviso y no se permite finalizar el pedido.
export default function CartScreen() {
  const router = useRouter()
  const { cart, total, itemCount, setQuantity, removeItem, refreshStock } = useCart()
  const { isLogged, isConfirmed } = useAuth()

  // Cada vez que se abre el carrito, revisamos el stock actual en el servidor.
  const refreshRef = useRef(refreshStock)
  refreshRef.current = refreshStock
  useFocusEffect(useCallback(() => { refreshRef.current() }, []))

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Tu carrito está vacío"
          subtitle="Agrega productos desde el catálogo para poder realizar un pedido."
          action={<Button title="Ir al catálogo" icon="grid-outline" onPress={() => router.push('/(tabs)/products')} />}
        />
        <Button title="Finalizar compra" icon="bag-check-outline" disabled style={styles.disabledBtn} />
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
          <CartItem item={item} onChangeQuantity={setQuantity} onRemove={removeItem} />
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
          <Text style={styles.totalLabel}>Total ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</Text>
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
  disabledBtn: { marginHorizontal: spacing.xl },
  footer: {
    backgroundColor: colors.white, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cream[200],
    ...shadow.floating,
  },
  warn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  warnText: { color: colors.warning, fontSize: 13, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.bark[500] },
  totalValue: { fontSize: 22, fontWeight: '900', color: colors.bark[800] },
})
