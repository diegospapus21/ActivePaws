import { useState, useEffect, useCallback } from 'react'
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { api } from '../../src/api/client'
import { CATEGORIES } from '../../src/config'
import { useAuth } from '../../src/context/AuthContext'
import ProductCard from '../../src/components/ProductCard'
import { Loading, EmptyState } from '../../src/components/ui'
import { colors, radii, spacing, shadow } from '../../src/theme/theme'

const CATEGORY_ICONS = {
  'Ropa para Perros': 'shirt-outline',
  'Ropa para Gatos': 'shirt-outline',
  Accesorios: 'ribbon-outline',
}

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setError('')
      const data = await api.get('/products?status=Activo', { auth: false })
      setProducts(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los productos.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const onRefresh = () => { setRefreshing(true); load() }

  if (loading) return <Loading />

  const featured = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.paw[500]} />}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroHi}>{user ? `¡Hola, ${user.name.split(' ')[0]}! 🐾` : '¡Bienvenido a ActivePaws! 🐾'}</Text>
        <Text style={styles.heroTitle}>Consiente a tu mascota con estilo</Text>
        <Text style={styles.heroSub}>Ropa y accesorios de calidad para perros y gatos.</Text>
        <Pressable style={styles.heroBtn} onPress={() => router.push('/(tabs)/products')}>
          <Text style={styles.heroBtnText}>Ver catálogo</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.paw[700]} />
        </Pressable>
      </View>

      {/* Categorías */}
      <Text style={styles.sectionTitle}>Categorías</Text>
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            style={styles.categoryCard}
            onPress={() => router.push({ pathname: '/(tabs)/products', params: { category: cat } })}
          >
            <View style={styles.categoryIcon}>
              <Ionicons name={CATEGORY_ICONS[cat] || 'paw-outline'} size={24} color={colors.paw[600]} />
            </View>
            <Text style={styles.categoryText}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {/* Destacados */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lo más vendido</Text>
        <Pressable onPress={() => router.push('/(tabs)/products')}>
          <Text style={styles.seeAll}>Ver todo</Text>
        </Pressable>
      </View>

      {error ? (
        <EmptyState icon="cloud-offline-outline" title="Error de conexión" subtitle={error} />
      ) : featured.length === 0 ? (
        <EmptyState icon="pricetags-outline" title="Sin productos" subtitle="Aún no hay productos disponibles." />
      ) : (
        <FlatList
          data={featured}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
          contentContainerStyle={{ gap: spacing.md }}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  hero: {
    backgroundColor: colors.paw[500],
    margin: spacing.lg,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    ...shadow.floating,
  },
  heroHi: { color: colors.paw[100], fontWeight: '800', fontSize: 14 },
  heroTitle: { color: colors.white, fontWeight: '900', fontSize: 24, marginTop: 6, lineHeight: 30 },
  heroSub: { color: colors.paw[100], fontSize: 14, marginTop: 6, lineHeight: 20 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: colors.white, paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: radii.pill, marginTop: spacing.lg,
  },
  heroBtnText: { color: colors.paw[700], fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginTop: spacing.xl,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.bark[800], paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.md },
  seeAll: { color: colors.paw[600], fontWeight: '800', marginTop: spacing.xl, marginBottom: spacing.md },
  categories: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg },
  categoryCard: {
    flex: 1, backgroundColor: colors.white, borderRadius: radii.lg, paddingVertical: spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: colors.cream[200], ...shadow.card,
  },
  categoryIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.paw[50],
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: colors.bark[600], textAlign: 'center', paddingHorizontal: 4 },
})
