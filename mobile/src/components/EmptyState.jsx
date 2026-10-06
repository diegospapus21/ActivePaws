import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../theme/theme'

// Mensaje centrado para listas vacías, errores o pantallas sin sesión.
export default function EmptyState({ icon = 'paw-outline', title, subtitle, action }) {
  return (
    <View style={styles.empty}>
      <View style={styles.icon}>
        <Ionicons name={icon} size={40} color={colors.paw[400]} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      {action ? <View style={{ marginTop: spacing.lg }}>{action}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  icon: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.paw[50],
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.bark[700], textAlign: 'center' },
  sub: { fontSize: 14, color: colors.bark[400], textAlign: 'center', marginTop: 6, lineHeight: 20 },
})
