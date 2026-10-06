import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Field } from '../components'
import { colors, spacing } from '../theme/theme'
import { validateEmail } from '../utils/validators'

// Paso 1 de la recuperación: pedir el correo y enviar un código de 6 dígitos.
export default function ForgotPasswordScreen() {
  const router = useRouter()
  const { forgotPassword } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async () => {
    const msg = validateEmail(email)
    if (msg) { setError(msg); return }
    setError('')
    setLoading(true)
    const cleanEmail = email.trim().toLowerCase()
    try {
      const res = await forgotPassword(cleanEmail)
      showToast(res.message || 'Te enviamos un código a tu correo.', 'success')
      router.push({ pathname: '/(auth)/reset-password', params: { email: cleanEmail } })
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="key-outline" size={40} color={colors.paw[500]} />
        </View>
        <Text style={styles.subtitle}>
          Ingresa el correo con el que te registraste y te enviaremos un código de 6 dígitos para crear una nueva contraseña.
        </Text>
        <Field
          label="Correo electrónico"
          icon="mail-outline"
          placeholder="tucorreo@ejemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(t) => { setEmail(t); setError('') }}
          error={error}
        />
        <Button title="Enviar código" icon="paper-plane-outline" onPress={onSubmit} loading={loading} />
        <Button
          title="Ya tengo un código"
          variant="ghost"
          onPress={() => {
            const msg = validateEmail(email)
            if (msg) { setError('Escribe tu correo para continuar.'); return }
            router.push({ pathname: '/(auth)/reset-password', params: { email: email.trim().toLowerCase() } })
          }}
          style={{ marginTop: spacing.sm }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  container: { flex: 1, padding: spacing.xl },
  iconWrap: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.paw[50], alignSelf: 'center',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, marginTop: spacing.lg,
  },
  subtitle: { fontSize: 14, color: colors.bark[500], lineHeight: 20, marginBottom: spacing.xl, textAlign: 'center' },
})
