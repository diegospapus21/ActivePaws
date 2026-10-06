import { StyleSheet, Text, View } from 'react-native'
import { radii, statusStyle } from '../theme/theme'

// Insignia de color según el estado (Pendiente, Enviado, Entregado, Cancelado, Activo…)
export default function StatusBadge({ status }) {
  const s = statusStyle(status)
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{status}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  text: { fontSize: 12, fontWeight: '700' },
})
