import { useState, useEffect, useCallback } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { api } from '../../src/api/client'
import { useCart } from '../../src/context/CartContext'
import { useAuth } from '../../src/context/AuthContext'
import { useToast } from '../../src/context/ToastContext'
import { Button, Stars, Loading, EmptyState, Card } from '../../src/components/ui'
import { colors, radii, spacing, shadow } from '../../src/theme/theme'
import { formatPrice, initials } from '../../src/utils/format'

export default function ProductDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { isLogged, isConfirmed } = useAuth()
  const { showToast } = useToast()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [canReview, setCanReview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  // Formulario de reseña
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
      }
    } catch (err) {
      showToast(err.message || 'No se pudo cargar el producto.', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, isLogged, showToast])

  useEffect(() => { load() }, [load])

  const submitReview = async () => {
    if (!comment.trim()) { showToast('Escribe un comentario para tu reseña.', 'warning'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/reviews', { productId: id, rating, comment: comment.trim() })
      setReviews((prev) => [res.review, ...prev])
      setCanReview(false)
      setComment('')
      setRating(5)
      showToast('¡Gracias por tu reseña!', 'success')
      // Recargar promedio del producto
      try { setProduct(await api.get(`/products/${id}`, { auth: false })) } catch { /* noop */ }
    } catch (err) {
      showToast(err.message || 'No se pudo publicar la reseña.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />
  if (!product) {
    return <EmptyState icon="alert-circle-outline" title="Producto no encontrado" />
  }

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
                {product.avgRating ? product.avgRating.toFixed(1) : 'Sin'} · {product.reviewCount || 0} reseña{(product.reviewCount || 0) === 1 ? '' : 's'}
              </Text>
            </View>

            <Text style={styles.price}>{formatPrice(product.price, product.currency)}</Text>

            <View style={styles.stockRow}>
              <Ionicons name={outOfStock ? 'close-circle' : 'checkmark-circle'} size={16} color={outOfStock ? colors.error : colors.success} />
              <Text style={[styles.stock, { color: outOfStock ? colors.error : colors.success }]}>
                {outOfStock ? 'Agotado' : `${product.stock} disponibles`}
              </Text>
            </View>

            {product.description ? <Text style={styles.description}>{product.description}</Text> : null}

            {/* Selector de cantidad */}
            {!outOfStock && (
              <View style={styles.qtyRow}>
                <Text style={styles.qtyLabel}>Cantidad</Text>
                <View style={styles.qtyControls}>
                  <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn} hitSlop={6}>
                    <Ionicons name="remove" size={18} color={colors.bark[600]} />
                  </Pressable>
                  <Text style={styles.qty}>{qty}</Text>
                  <Pressable onPress={() => setQty((q) => Math.min(product.stock, q + 1))} style={styles.qtyBtn} hitSlop={6}>
                    <Ionicons name="add" size={18} color={colors.bark[600]} />
                  </Pressable>
                </View>
              </View>
            )}

            <Button
              title={outOfStock ? 'Agotado' : 'Agregar al carrito'}
              icon="cart-outline"
              disabled={outOfStock}
              onPress={() => { addItem(product, qty); }}
              style={{ marginTop: spacing.lg }}
            />

            {/* Reseñas */}
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reseñas</Text>
            </View>

            {/* Escribir reseña */}
            {isLogged && canReview && (
              <Card style={{ marginBottom: spacing.md }}>
                <Text style={styles.writeTitle}>Deja tu reseña</Text>
                <View style={{ marginVertical: 10 }}>
                  <Stars value={rating} size={28} onChange={setRating} />
                </View>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Cuéntanos qué te pareció el producto…"
                  placeholderTextColor={colors.bark[300]}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={3}
                />
                <Button title="Publicar reseña" icon="send-outline" onPress={submitReview} loading={submitting} style={{ marginTop: spacing.md }} />
              </Card>
            )}

            {isLogged && !canReview && !isConfirmed && (
              <Text style={styles.hint}>Verifica tu correo para poder dejar reseñas.</Text>
            )}
            {isLogged && !canReview && isConfirmed && (
              <Text style={styles.hint}>Solo puedes reseñar productos que hayas comprado y recibido.</Text>
            )}
            {!isLogged && (
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.hintLink}>Inicia sesión para dejar una reseña.</Text>
              </Pressable>
            )}

            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>Todavía no hay reseñas para este producto.</Text>
            ) : (
              reviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>{initials(rev.userName)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{rev.userName}</Text>
                      <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>
                    <Stars value={rev.rating} size={14} />
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))
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
  description: { fontSize: 15, color: colors.bark[500], lineHeight: 22, marginTop: spacing.md },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  qtyLabel: { fontSize: 15, fontWeight: '700', color: colors.bark[600] },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.cream[300],
  },
  qty: { fontSize: 18, fontWeight: '900', color: colors.bark[800], minWidth: 24, textAlign: 'center' },
  reviewsHeader: { marginTop: spacing.xxl, marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.bark[800] },
  writeTitle: { fontSize: 15, fontWeight: '800', color: colors.bark[700] },
  reviewInput: {
    backgroundColor: colors.cream[100], borderRadius: radii.md, borderWidth: 1, borderColor: colors.cream[300],
    padding: 12, fontSize: 14, color: colors.bark[700], minHeight: 80, textAlignVertical: 'top',
  },
  hint: { fontSize: 13, color: colors.bark[400], fontStyle: 'italic', marginBottom: spacing.md },
  hintLink: { fontSize: 13, color: colors.paw[600], fontWeight: '800', marginBottom: spacing.md },
  noReviews: { fontSize: 14, color: colors.bark[400], marginTop: spacing.md },
  reviewCard: {
    backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cream[200], marginTop: spacing.md, ...shadow.card,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.paw[100], alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: colors.paw[700], fontWeight: '800', fontSize: 13 },
  reviewName: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  reviewDate: { fontSize: 12, color: colors.bark[300] },
  reviewComment: { fontSize: 14, color: colors.bark[600], lineHeight: 20, marginTop: 8 },
})
