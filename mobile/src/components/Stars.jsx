import { Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/theme'

// Estrellas de calificación. Si recibe onChange se vuelve seleccionable.
export default function Stars({ value = 0, size = 16, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const name = i <= Math.round(value) ? 'star' : 'star-outline'
        const star = <Ionicons name={name} size={size} color={colors.paw[400]} />
        return onChange ? (
          <Pressable key={i} onPress={() => onChange(i)} hitSlop={6}>{star}</Pressable>
        ) : (
          <View key={i}>{star}</View>
        )
      })}
    </View>
  )
}
