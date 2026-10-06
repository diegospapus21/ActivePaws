import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radii, spacing } from '../theme/theme'

const STEPS = ['Pendiente', 'Enviado', 'Entregado']

// Línea de progreso del pedido (o aviso si fue cancelado).
export default function OrderTracker({ status }) {
  if (status === 'Cancelado') {
    return (
      <View style={styles.cancelled}>
        <Ionicons name="close-circle-outline" size={18} color={colors.error} />
        <Text style={styles.cancelledText}>Este pedido fue cancelado.</Text>
      </View>
    )
  }
  const current = STEPS.indexOf(status)
  return (
    <View style={styles.tracker}>
      {STEPS.map((step, i) => {
        const done = i <= current
        return (
          <View key={step} style={styles.step}>
            <View style={styles.lineWrap}>
              {i > 0 && <View style={[styles.line, i <= current && styles.lineDone]} />}
              <View style={[styles.dot, done && styles.dotDone]}>
                {done && <Ionicons name="checkmark" size={12} color={colors.white} />}
              </View>
              {i < STEPS.length - 1 && <View style={[styles.line, i < current && styles.lineDone]} />}
            </View>
            <Text style={[styles.label, done && styles.labelDone]}>{step}</Text>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tracker: { flexDirection: 'row', marginTop: spacing.xl },
  step: { flex: 1, alignItems: 'center' },
  lineWrap: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center' },
  line: { flex: 1, height: 3, backgroundColor: colors.cream[300] },
  lineDone: { backgroundColor: colors.paw[400] },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.cream[300], alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.paw[500] },
  label: { fontSize: 12, color: colors.bark[400], marginTop: 6, fontWeight: '600' },
  labelDone: { color: colors.bark[700], fontWeight: '800' },
  cancelled: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.lg, backgroundColor: colors.status.cancelledBg, padding: 10, borderRadius: radii.md },
  cancelledText: { color: colors.error, fontWeight: '700', fontSize: 13 },
})
