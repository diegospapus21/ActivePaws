import { useState } from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Field from './Field'
import { colors } from '../theme/theme'

// Campo de contraseña con botón para mostrar / ocultar el texto.
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false)
  return (
    <Field
      icon="lock-closed-outline"
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      right={
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.bark[400]} />
        </Pressable>
      }
    />
  )
}
