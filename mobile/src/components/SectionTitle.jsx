import { StyleSheet, Text } from 'react-native'
import { colors, spacing } from '../theme/theme'

// Título de sección dentro de una pantalla.
export default function SectionTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '900', color: colors.bark[800], marginTop: spacing.lg, marginBottom: spacing.md },
})
