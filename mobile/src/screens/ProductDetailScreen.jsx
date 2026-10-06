import { useState, useEffect, useCallback } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { api } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, EmptyState, Loading, QuantitySelector, ReviewCard, ReviewForm, Stars } from '../components'
import { colors, spacing } from '../theme/theme'
import { formatPrice } from '../utils/format'

// Detalle del producto: precio, stock, cantidad, agregar al carrito, valoraciones y reseñas.
// Solo se puede reseñar un producto comprado y entregado (lo valida la API).
export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { addItem, quantityOf } = useCart()
  const { isLogged, isConfirmed } = useAuth()
  const { showToast } = useToast()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [canReview, setCanReview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  const load = useCallback(async () => {
    try {
      const [p, r] = await Promise.all([
        api.get(`/products/${id}`, { auth: false }),
        api.get(`/reviews?productId=${id}`, { auth: false }),
      ])
      setProduct(p)
      setReviews(r)
      if (isLogged) {
        try {
          const cr = await api.get(`/reviews/can-review/${id}`)
          setCanReview(cr.canReview)
        } catch { setCanReview(false) }
      } else {
        setCanReview(false)
      }
    } catch (err) {
      showToast(err.message || 'No se pudo cargar el producto.', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, isLogged, showToast])

  useEffect(() => { load() }, [load])

  const inCart = product ? quantityOf(product.id) : 0
  const available = product ? Math.max(0, product.stock - inCart) : 0

  // Si cambia lo disponible (ej. se agregó al carrito), la cantidad no puede pasarse
  useEffect(() => {
    setQty((q) => Math.max(1, Math.min(q, available || 1)))
  }, [available])

  const submitReview = async ({ rating, comment }) => {
    try {
      const res = await api.post('/reviews', { productId: id, rating, comment })
      setReviews((prev) => [res.review, ...prev])
      setCanReview(false)
      showToast('¡Gracias por tu reseña!', 'success')
      try { setProduct(await api.get(`/products/${id}`, { auth: false })) } catch { /* noop */ }
      return true
    } catch (err) {
      showToast(err.message || 'No se pudo publicar la reseña.', 'error')
      return false
    }
  }

  const onAdd = () => {
    if (addItem(product, qty)) setQty(1)
  }

  if (loading) return <Loading />
  if (!product) return <EmptyState icon="alert-circle-outline" title="Producto no encontrado" />

  const outOfStock = product.stock <= 0

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: product.name }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          <Image source={{ uri: product.image }} style={styles.hero} contentFit="cover" transition={200} />

          <View style={styles.body}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name}>{product.name}</Text>

            <View style={styles.ratingRow}>
              <Stars value={product.avgRating || 0} />
              <Text style={styles.ratingText}>
                {product.avgRating ? product.avgRating.toFixed(1) : 'Sin valoraciones'} · {product.reviewCount || 0} reseña{(product.reviewCount || 0) === 1 ? '' : 's'}
              </Text>
            </View>

            <Text style={styles.price}>{formatPrice(product.price, product.currency)}</Text>

            <View style={styles.stockRow}>
              <Ionicons name={outOfStock ? 'close-circle' : 'checkmark-circle'} size={16} color={outOfStock ? colors.error : colors.success} />
              <Text style={[styles.stock, { color: outOfStock ? colors.error : colors.success }]}>
                {outOfStock ? 'Agotado' : `${product.stock} disponibles`}
              </Text>
            </View>
            {inCart > 0 && (
              <Text style={styles.inCart}>Ya tienes {inCart} en tu carrito.</Text>
            )}

            {product.description ? <Text style={styles.description}>{product.description}</Text> : null}

            {/* Selector de cantidad: entre 1 y lo que queda disponible */}
            {available > 0 && (
              <View style={styles.qtyRow}>
                <Text style={styles.qtyLabel}>Cantidad</Text>
                <QuantitySelector value={qty} onChange={setQty} min={1} max={available} />
              </View>
            )}

            <Button
              title={outOfStock ? 'Agotado' : available === 0 ? 'Sin más unidades disponibles' : 'Agregar al carrito'}
              icon="cart-outline"
              disabled={outOfStock || available === 0}
              onPress={onAdd}
              style={{ marginTop: spacing.lg }}
            />

            {/* Reseñas */}
            <Text style={styles.sectionTitle}>Reseñas</Text>

            {isLogged && canReview && <ReviewForm onSubmit={submitReview} />}

            {isLogged && !canReview && !isConfirmed && (
              <Text style={styles.hint}>Verifica tu correo para poder dejar reseñas.</Text>
            )}
            {isLogged && !canReview && isConfirmed && (
              <Text style={styles.hint}>Solo puedes valorar productos que hayas comprado y recibido (una reseña por producto).</Text>
            )}
            {!isLogged && (
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.hintLink}>Inicia sesión para dejar una reseña.</Text>
              </Pressable>
            )}

            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>Todavía no hay reseñas para este producto.</Text>
            ) : (
              reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  hero: { width: '100%', aspectRatio: 1, backgroundColor: colors.cream[100] },
  body: { padding: spacing.lg },
  category: { fontSize: 12, color: colors.paw[600], fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  name: { fontSize: 24, fontWeight: '900', color: colors.bark[800], marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  ratingText: { fontSize: 13, color: colors.bark[400], fontWeight: '600' },
  price: { fontSize: 26, fontWeight: '900', color: colors.bark[800], marginTop: spacing.md },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  stock: { fontSize: 13, fontWeight: '700' },
  inCart: { fontSize: 13, color: colors.bark[500], fontWeight: '600', marginTop: 4 },
  description: { fontSize: 15, color: colors.bark[500], lineHeight: 22, marginTop: spacing.md },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  qtyLabel: { fontSize: 15, fontWeight: '700', color: colors.bark[600] },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.bark[800], marginTop: spacing.xxl, marginBottom: spacing.md },
  hint: { fontSize: 13, color: colors.bark[400], fontStyle: 'italic', marginBottom: spacing.md },
  hintLink: { fontSize: 13, color: colors.paw[600], fontWeight: '800', marginBottom: spacing.md },
  noReviews: { fontSize: 14, color: colors.bark[400], marginTop: spacing.md },
})
