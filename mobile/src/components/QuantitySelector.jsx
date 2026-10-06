import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/theme'

/**
 * Selector de cantidad (− n +). Nunca baja de `min` ni sube de `max`, así no se
 * pueden pedir cantidades negativas ni más unidades que el stock disponible.
 */
export default function QuantitySelector({ value, onChange, min = 1, max = Infinity, size = 'md' }) {
  const btn = size === 'sm' ? 28 : 36
  const canDecrease = value > min
  const canIncrease = value < max
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        style={[styles.btn, { width: btn, height: btn, borderRadius: btn / 2 }, !canDecrease && styles.disabled]}
        hitSlop={6}
      >
        <Ionicons name="remove" size={size === 'sm' ? 16 : 18} color={colors.bark[600]} />
      </Pressable>
      <Text style={[styles.value, size === 'sm' && { fontSize: 15 }]}>{value}</Text>
      <Pressable
        onPress={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        style={[styles.btn, { width: btn, height: btn, borderRadius: btn / 2 }, !canIncrease && styles.disabled]}
        hitSlop={6}
      >
        <Ionicons name="add" size={size === 'sm' ? 16 : 18} color={colors.bark[600]} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btn: {
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.cream[300],
  },
  disabled: { opacity: 0.35 },
  value: { fontSize: 18, fontWeight: '900', color: colors.bark[800], minWidth: 24, textAlign: 'center' },
})
