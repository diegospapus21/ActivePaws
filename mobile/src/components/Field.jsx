import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radii, spacing } from '../theme/theme'

// Campo de formulario con etiqueta, icono y mensaje de error.
export default function Field({ label, error, icon, right, style, ...inputProps }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, error && { borderColor: colors.error }]}>
        {icon && <Ionicons name={icon} size={18} color={colors.bark[400]} style={{ marginRight: 8 }} />}
        <TextInput placeholderTextColor={colors.bark[300]} style={[styles.input, style]} {...inputProps} />
        {right}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', color: colors.bark[600], marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cream[100],
    borderWidth: 1, borderColor: colors.cream[300], borderRadius: radii.md, paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.bark[700] },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4, fontWeight: '600' },
})
