import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../../src/context/AuthContext'
import { Button, Field } from '../../src/components/ui'
import { colors, spacing } from '../../src/theme/theme'

export default function ForgotPassword() {
  const router = useRouter()
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async () => {
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }
    setLoading(true)
    try {
      await forgotPassword(email.trim().toLowerCase())
      setSent(true)
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        {sent ? (
          <View style={styles.center}>
            <View style={styles.iconWrap}>
              <Ionicons name="checkmark-circle-outline" size={44} color={colors.success} />
            </View>
            <Text style={styles.title}>Revisa tu correo</Text>
            <Text style={styles.subtitle}>
              Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.
              El enlace es válido por 30 minutos.
            </Text>
            <Button title="Volver a iniciar sesión" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: spacing.xl, alignSelf: 'stretch' }} />
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Ingresa el correo con el que te registraste y te enviaremos un enlace para crear una nueva contraseña.
            </Text>
            <Field
              label="Correo electrónico"
              icon="mail-outline"
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              error={error}
            />
            <Button title="Enviar enlace" icon="paper-plane-outline" onPress={onSubmit} loading={loading} />
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  container: { flex: 1, padding: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.cream[100],
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.bark[800], textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.bark[500], lineHeight: 20, marginBottom: spacing.xl, textAlign: 'center' },
})
