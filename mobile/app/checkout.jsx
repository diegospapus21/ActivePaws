import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useCart } from '../src/context/CartContext'
import { useAuth } from '../src/context/AuthContext'
import { useToast } from '../src/context/ToastContext'
import { Button, Field } from '../src/components/ui'
import { colors, radii, spacing, shadow } from '../src/theme/theme'
import { formatPrice } from '../src/utils/format'

export default function Checkout() {
  const router = useRouter()
  const { cart, total, checkout } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ name: user?.name || '', address: '', city: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Ingresa el nombre de quien recibe.'
    if (!form.address.trim()) e.address = 'Ingresa la dirección de envío.'
    if (!form.city.trim()) e.city = 'Ingresa la ciudad.'
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) e.phone = 'Ingresa un teléfono válido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onConfirm = async () => {
    if (!validate()) return
    setLoading(true)
    const res = await checkout({
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
    })
    setLoading(false)

    if (res.ok) {
      showToast(res.message || '¡Compra realizada con éxito!', 'success')
      router.replace(`/order/${res.order.id}`)
      return
    }
    if (res.reason === 'auth') { router.replace('/(auth)/login'); return }
    if (res.reason === 'confirm') {
      showToast(res.message, 'warning')
      router.replace({ pathname: '/(auth)/verify', params: { email: user?.email } })
      return
    }
    showToast(res.message || 'No se pudo completar la compra.', 'error')
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          {/* Resumen del pedido */}
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summary}>
            {cart.map((item) => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryQty}>{item.quantity}×</Text>
                <Text style={styles.summaryName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.summaryPrice}>{formatPrice(item.price * item.quantity, item.currency)}</Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>{formatPrice(total)}</Text>
            </View>
          </View>

          {/* Datos de envío */}
          <Text style={styles.sectionTitle}>Datos de envío</Text>
          <Field label="Nombre de quien recibe" icon="person-outline" value={form.name} onChangeText={set('name')} error={errors.name} />
          <Field label="Dirección" icon="location-outline" placeholder="Calle, número, colonia" value={form.address} onChangeText={set('address')} error={errors.address} />
          <Field label="Ciudad" icon="business-outline" value={form.city} onChangeText={set('city')} error={errors.city} />
          <Field label="Teléfono" icon="call-outline" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} error={errors.phone} />

          {/* Método de pago (demostrativo) */}
          <Text style={styles.sectionTitle}>Método de pago</Text>
          <View style={styles.payCard}>
            <Ionicons name="cash-outline" size={22} color={colors.paw[600]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.payTitle}>Pago contra entrega</Text>
              <Text style={styles.paySub}>Paga en efectivo cuando recibas tu pedido.</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          </View>

          <Button title="Confirmar compra" icon="bag-check-outline" onPress={onConfirm} loading={loading} style={{ marginTop: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.bark[800], marginTop: spacing.lg, marginBottom: spacing.md },
  summary: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  summaryQty: { fontSize: 13, fontWeight: '800', color: colors.paw[600], minWidth: 26 },
  summaryName: { flex: 1, fontSize: 14, color: colors.bark[600], fontWeight: '600' },
  summaryPrice: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  summaryDivider: { height: 1, backgroundColor: colors.cream[200], marginVertical: 8 },
  summaryTotalLabel: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.bark[700] },
  summaryTotalValue: { fontSize: 18, fontWeight: '900', color: colors.bark[800] },
  payCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white,
    borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.cream[200], ...shadow.card,
  },
  payTitle: { fontSize: 15, fontWeight: '800', color: colors.bark[700] },
  paySub: { fontSize: 13, color: colors.bark[400], marginTop: 2 },
})
