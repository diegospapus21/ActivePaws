import { StyleSheet, View } from 'react-native'
import { colors, radii, spacing, shadow } from '../theme/theme'

// Tarjeta contenedora blanca con borde y sombra.
export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: radii.xl, borderWidth: 1,
    borderColor: colors.cream[200], padding: spacing.lg, ...shadow.card,
  },
})
