import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/theme'

// Línea "icono + texto" (datos de envío del pedido).
export default function InfoLine({ icon, text }) {
  return (
    <View style={styles.line}>
      <Ionicons name={icon} size={16} color={colors.bark[400]} />
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  text: { fontSize: 14, color: colors.bark[600], flex: 1 },
})
