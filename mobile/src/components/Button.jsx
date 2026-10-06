import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radii } from '../theme/theme'

// Botón reutilizable con variantes: primary, secondary, outline, danger, ghost.
const PALETTES = {
  primary: { bg: colors.paw[500], text: colors.white, border: 'transparent' },
  secondary: { bg: colors.bark[200], text: colors.bark[700], border: 'transparent' },
  outline: { bg: 'transparent', text: colors.paw[600], border: colors.paw[500] },
  danger: { bg: colors.error, text: colors.white, border: 'transparent' },
  ghost: { bg: 'transparent', text: colors.bark[600], border: 'transparent' },
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const isDisabled = disabled || loading
  const p = PALETTES[variant] || PALETTES.primary
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: p.bg, borderColor: p.border, borderWidth: p.border === 'transparent' ? 0 : 2 },
        pressed && !isDisabled && { transform: [{ scale: 0.97 }] },
        isDisabled && { opacity: 0.55 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.text} />
      ) : (
        <View style={styles.inner}>
          {icon && <Ionicons name={icon} size={18} color={p.text} />}
          <Text style={[styles.text, { color: p.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: { borderRadius: radii.md, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 15, fontWeight: '700' },
})
