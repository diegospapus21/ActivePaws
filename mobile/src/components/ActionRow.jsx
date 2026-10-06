import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radii } from '../theme/theme'

// Fila presionable con icono y flecha (accesos rápidos del perfil).
export default function ActionRow({ icon, label, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.cream[100] }]} onPress={onPress}>
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={colors.paw[600]} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.bark[300]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderRadius: radii.md },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 15, fontWeight: '700', color: colors.bark[700] },
})
