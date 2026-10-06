import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import Card from './Card'
import Stars from './Stars'
import Button from './Button'
import { colors, radii, spacing } from '../theme/theme'

const MAX_COMMENT = 300

/**
 * Formulario para valorar y comentar un producto comprado.
 * El estado (estrellas y comentario) vive aquí y se limpia al publicar.
 */
export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const text = comment.trim()
    if (text.length < 5) { setError('El comentario debe tener al menos 5 caracteres.'); return }
    if (rating < 1 || rating > 5) { setError('Selecciona de 1 a 5 estrellas.'); return }
    setError('')
    setLoading(true)
    const ok = await onSubmit({ rating, comment: text })
    setLoading(false)
    if (ok) { setComment(''); setRating(5) }
  }

  return (
    <Card style={{ marginBottom: spacing.md }}>
      <Text style={styles.title}>Deja tu reseña</Text>
      <View style={{ marginVertical: 10 }}>
        <Stars value={rating} size={28} onChange={setRating} />
      </View>
      <TextInput
        style={[styles.input, error && { borderColor: colors.error }]}
        placeholder="Cuéntanos qué te pareció el producto…"
        placeholderTextColor={colors.bark[300]}
        value={comment}
        onChangeText={(t) => { setComment(t); setError('') }}
        maxLength={MAX_COMMENT}
        multiline
        numberOfLines={3}
      />
      <Text style={styles.counter}>{comment.length}/{MAX_COMMENT}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Publicar reseña" icon="send-outline" onPress={submit} loading={loading} style={{ marginTop: spacing.md }} />
    </Card>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 15, fontWeight: '800', color: colors.bark[700] },
  input: {
    backgroundColor: colors.cream[100], borderRadius: radii.md, borderWidth: 1, borderColor: colors.cream[300],
    padding: 12, fontSize: 14, color: colors.bark[700], minHeight: 80, textAlignVertical: 'top',
  },
  counter: { alignSelf: 'flex-end', fontSize: 11, color: colors.bark[300], marginTop: 4 },
  error: { color: colors.error, fontSize: 12, fontWeight: '600', marginTop: 4 },
})
