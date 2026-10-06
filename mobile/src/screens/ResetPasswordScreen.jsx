import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Field, PasswordField } from '../components'
import { colors, spacing } from '../theme/theme'
import { collectErrors, validateConfirm, validatePassword } from '../utils/validators'

// Paso 2 de la recuperación: código recibido por correo + nueva contraseña.
export default function ResetPasswordScreen() {
  const router = useRouter()
  const { email } = useLocalSearchParams()
  const { resetPassword, forgotPassword } = useAuth()
  const { showToast } = useToast()

  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const onSubmit = async () => {
    const e = collectErrors({
      code: /^\d{6}$/.test(code) ? '' : 'El código debe tener 6 dígitos.',
      password: validatePassword(password),
      confirm: validateConfirm(password, confirm),
    })
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      const res = await resetPassword(String(email), code, password)
      showToast(res.message || 'Contraseña actualizada.', 'success')
      setCode(''); setPassword(''); setConfirm('')
      router.dismissTo('/(auth)/login')
    } catch (err) {
      setErrors({ code: err.message || 'No se pudo restablecer la contraseña.' })
    } finally {
      setLoading(false)
    }
  }

  const onResend = async () => {
    setResending(true)
    try {
      await forgotPassword(String(email))
      showToast('Te enviamos un código nuevo.', 'info')
    } catch (err) {
      showToast(err.message || 'No se pudo reenviar el código.', 'error')
    } finally {
      setResending(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitle}>
            Escribe el código de 6 dígitos que enviamos a{'\n'}
            <Text style={styles.email}>{String(email)}</Text>
          </Text>

          <Field
            label="Código de verificación"
            icon="keypad-outline"
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={(t) => { setCode(t.replace(/[^0-9]/g, '')); setErrors((e) => ({ ...e, code: '' })) }}
            error={errors.code}
          />
          <PasswordField label="Nueva contraseña" placeholder="Mínimo 6 caracteres" value={password} onChangeText={setPassword} error={errors.password} />
          <PasswordField label="Confirmar contraseña" placeholder="Repite la contraseña" value={confirm} onChangeText={setConfirm} error={errors.confirm} />

          <Button title="Cambiar contraseña" icon="shield-checkmark-outline" onPress={onSubmit} loading={loading} />

          <Pressable onPress={onResend} disabled={resending} style={{ marginTop: spacing.xl, alignSelf: 'center' }}>
            <Text style={styles.link}>{resending ? 'Enviando…' : '¿No te llegó? Reenviar código'}</Text>
          </Pressable>

          <Text style={styles.hint}>
            Si el backend no tiene SMTP configurado, el código aparece en la consola del servidor.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  scroll: { padding: spacing.xl },
  subtitle: { fontSize: 14, color: colors.bark[500], lineHeight: 20, marginBottom: spacing.xl, textAlign: 'center' },
  email: { fontWeight: '800', color: colors.bark[700] },
  link: { color: colors.paw[600], fontWeight: '800', fontSize: 14 },
  hint: { color: colors.bark[300], fontSize: 12, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 },
})
