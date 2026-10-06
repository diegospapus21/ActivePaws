import { StyleSheet, Text, View } from 'react-native'
import Stars from './Stars'
import { colors, radii, spacing, shadow } from '../theme/theme'
import { initials } from '../utils/format'

// Reseña de un cliente: avatar con iniciales, nombre, fecha, estrellas y comentario.
export default function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(review.userName)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{review.userName}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        <Stars value={review.rating} size={14} />
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cream[200], marginTop: spacing.md, ...shadow.card,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.paw[100], alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.paw[700], fontWeight: '800', fontSize: 13 },
  name: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  date: { fontSize: 12, color: colors.bark[300] },
  comment: { fontSize: 14, color: colors.bark[600], lineHeight: 20, marginTop: 8 },
})
