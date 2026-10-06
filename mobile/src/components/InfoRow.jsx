import { StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/theme'

// Fila "icono + etiqueta ……… valor" (datos de la cuenta en el perfil).
export default function InfoRow({ icon, label, value, valueColor }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Ionicons name={icon} size={18} color={colors.bark[400]} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 14, color: colors.bark[500], fontWeight: '600' },
  value: { fontSize: 14, fontWeight: '800', color: colors.bark[700], flexShrink: 1, textAlign: 'right', marginLeft: 12 },
})
