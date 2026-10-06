import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { colors } from '../theme/theme'

// Indicador de carga a pantalla completa.
export default function Loading({ label = 'Cargando…' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.paw[500]} />
      <Text style={styles.text}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.cream[50] },
  text: { color: colors.bark[500], fontWeight: '600' },
})
