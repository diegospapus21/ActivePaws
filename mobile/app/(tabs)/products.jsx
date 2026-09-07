import { useState, useEffect, useCallback } from 'react'
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'

import { api } from '../../src/api/client'
import { CATEGORIES } from '../../src/config'
import ProductCard from '../../src/components/ProductCard'
import { Loading, EmptyState } from '../../src/components/ui'
import { colors, radii, spacing } from '../../src/theme/theme'

export default function Products() {
  const params = useLocalSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(params.category ? String(params.category) : null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setError('')
      const qs = new URLSearchParams({ status: 'Activo' })
      if (category) qs.set('category', category)
      if (search.trim()) qs.set('search', search.trim())
      const data = await api.get(`/products?${qs.toString()}`, { auth: false })
      setProducts(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los productos.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [category, search])

  // Recarga al cambiar categoría; búsqueda con debounce
  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  const onRefresh = () => { setRefreshing(true); load() }

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.bark[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos…"
          placeholderTextColor={colors.bark[300]}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search ? (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.bark[300]} />
          </Pressable>
        ) : null}
      </View>

      {/* Chips de categoría */}
      <FlatList
        data={['Todos', ...CATEGORIES]}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsList}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
        renderItem={({ item }) => {
          const active = item === 'Todos' ? !category : category === item
          return (
            <Pressable
              onPress={() => setCategory(item === 'Todos' ? null : item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          )
        }}
      />

      {loading ? (
        <Loading />
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Error de conexión" subtitle={error} />
      ) : products.length === 0 ? (
        <EmptyState icon="search-outline" title="Sin resultados" subtitle="Prueba con otra búsqueda o categoría." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg }}
          contentContainerStyle={{ gap: spacing.md, paddingVertical: spacing.md, paddingBottom: 32 }}
          renderItem={({ item }) => <ProductCard product={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.paw[500]} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.white, marginHorizontal: spacing.lg, marginTop: spacing.md,
    borderRadius: radii.md, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.cream[200],
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.bark[700] },
  chipsList: { flexGrow: 0, marginTop: spacing.md },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill,
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.cream[300],
  },
  chipActive: { backgroundColor: colors.paw[500], borderColor: colors.paw[500] },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.bark[500] },
  chipTextActive: { color: colors.white },
})
