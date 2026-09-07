import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radii, spacing, shadow, statusStyle } from '../theme/theme'

// ─── Botón ─────────────────────────────────────────────────────────────────────
export function Button({ title, onPress, variant = 'primary', loading, disabled, icon, style }) {
  const isDisabled = disabled || loading
  const palettes = {
    primary: { bg: colors.paw[500], text: colors.white, border: 'transparent' },
    secondary: { bg: colors.bark[200], text: colors.bark[700], border: 'transparent' },
    outline: { bg: 'transparent', text: colors.paw[600], border: colors.paw[500] },
    danger: { bg: colors.error, text: colors.white, border: 'transparent' },
    ghost: { bg: 'transparent', text: colors.bark[600], border: 'transparent' },
  }
  const p = palettes[variant] || palettes.primary
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
        <View style={styles.btnInner}>
          {icon && <Ionicons name={icon} size={18} color={p.text} />}
          <Text style={[styles.btnText, { color: p.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  )
}

// ─── Insignia de estado ─────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const s = statusStyle(status)
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{status}</Text>
    </View>
  )
}

// ─── Estrellas de calificación ───────────────────────────────────────────────────
export function Stars({ value = 0, size = 16, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const name = i <= Math.round(value) ? 'star' : 'star-outline'
        const star = <Ionicons name={name} size={size} color={colors.paw[400]} />
        return onChange ? (
          <Pressable key={i} onPress={() => onChange(i)} hitSlop={6}>{star}</Pressable>
        ) : (
          <View key={i}>{star}</View>
        )
      })}
    </View>
  )
}

// ─── Campo de formulario ─────────────────────────────────────────────────────────
export function Field({ label, error, icon, right, style, ...inputProps }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, error && { borderColor: colors.error }]}>
        {icon && <Ionicons name={icon} size={18} color={colors.bark[400]} style={{ marginRight: 8 }} />}
        <TextInput
          placeholderTextColor={colors.bark[300]}
          style={[styles.input, style]}
          {...inputProps}
        />
        {right}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

// ─── Estado vacío ────────────────────────────────────────────────────────────────
export function EmptyState({ icon = 'paw-outline', title, subtitle, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={40} color={colors.paw[400]} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
      {action ? <View style={{ marginTop: spacing.lg }}>{action}</View> : null}
    </View>
  )
}

// ─── Cargando (pantalla completa) ─────────────────────────────────────────────────
export function Loading({ label = 'Cargando…' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.paw[500]} />
      <Text style={styles.loadingText}>{label}</Text>
    </View>
  )
}

// ─── Tarjeta contenedora ─────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { fontSize: 15, fontWeight: '700' },

  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  badgeText: { fontSize: 12, fontWeight: '700' },

  label: { fontSize: 13, fontWeight: '700', color: colors.bark[600], marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream[100],
    borderWidth: 1,
    borderColor: colors.cream[300],
    borderRadius: radii.md,
    paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.bark[700] },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4, fontWeight: '600' },

  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyIcon: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.paw[50],
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.bark[700], textAlign: 'center' },
  emptySub: { fontSize: 14, color: colors.bark[400], textAlign: 'center', marginTop: 6, lineHeight: 20 },

  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.cream[50] },
  loadingText: { color: colors.bark[500], fontWeight: '600' },

  card: { backgroundColor: colors.white, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.cream[200], padding: spacing.lg, ...shadow.card },
})
