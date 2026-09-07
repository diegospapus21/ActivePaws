import { useState, useRef } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../../src/context/AuthContext'
import { useToast } from '../../src/context/ToastContext'
import { Button } from '../../src/components/ui'
import { colors, radii, spacing } from '../../src/theme/theme'

const LEN = 6

export default function Verify() {
  const router = useRouter()
  const { email } = useLocalSearchParams()
  const { verifyCode, resendCode } = useAuth()
  const { showToast } = useToast()

  const [digits, setDigits] = useState(Array(LEN).fill(''))
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const inputs = useRef([])

  const onChange = (text, i) => {
    const clean = text.replace(/[^0-9]/g, '')
    setError('')
    if (clean.length > 1) {
      // Pegado del código completo
      const arr = clean.slice(0, LEN).split('')
      const next = Array(LEN).fill('')
      arr.forEach((d, idx) => { next[idx] = d })
      setDigits(next)
      inputs.current[Math.min(arr.length, LEN - 1)]?.focus()
      return
    }
    const next = [...digits]
    next[i] = clean
    setDigits(next)
    if (clean && i < LEN - 1) inputs.current[i + 1]?.focus()
  }

  const onKeyPress = (e, i) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const onSubmit = async () => {
    const code = digits.join('')
    if (code.length !== LEN) {
      setError('Ingresa los 6 dígitos del código.')
      return
    }
    setLoading(true)
    try {
      await verifyCode(String(email), code)
      showToast('¡Cuenta verificada! Ya puedes iniciar sesión.', 'success')
      router.replace('/(auth)/login')
    } catch (err) {
      setError(err.message || 'No se pudo verificar el código.')
    } finally {
      setLoading(false)
    }
  }

  const onResend = async () => {
    setResending(true)
    try {
      const res = await resendCode(String(email))
      showToast(res.message || 'Código reenviado.', 'info')
    } catch (err) {
      showToast(err.message || 'No se pudo reenviar el código.', 'error')
    } finally {
      setResending(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="mail-open-outline" size={40} color={colors.paw[500]} />
        </View>
        <Text style={styles.title}>Revisa tu correo</Text>
        <Text style={styles.subtitle}>
          Enviamos un código de 6 dígitos a{'\n'}
          <Text style={styles.email}>{String(email)}</Text>
        </Text>

        <View style={styles.codeRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(el) => { inputs.current[i] = el }}
              value={d}
              onChangeText={(t) => onChange(t, i)}
              onKeyPress={(e) => onKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={LEN}
              style={[styles.codeBox, d && styles.codeBoxFilled, error && styles.codeBoxError]}
              textAlign="center"
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title="Verificar" icon="shield-checkmark-outline" onPress={onSubmit} loading={loading} style={{ marginTop: spacing.lg }} />

        <View style={styles.resendRow}>
          <Text style={styles.muted}>¿No recibiste el código? </Text>
          <Pressable onPress={onResend} disabled={resending}>
            <Text style={styles.link}>{resending ? 'Enviando…' : 'Reenviar'}</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Consejo: si el backend no tiene SMTP configurado, el código aparece en la consola del servidor.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  container: { flex: 1, padding: spacing.xl, alignItems: 'center', paddingTop: spacing.xxl },
  iconWrap: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.paw[50],
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.bark[800] },
  subtitle: { fontSize: 14, color: colors.bark[500], textAlign: 'center', marginTop: 8, lineHeight: 20 },
  email: { fontWeight: '800', color: colors.bark[700] },
  codeRow: { flexDirection: 'row', gap: 8, marginTop: spacing.xxl },
  codeBox: {
    width: 46, height: 56, borderRadius: radii.md, backgroundColor: colors.white,
    borderWidth: 2, borderColor: colors.cream[300], fontSize: 22, fontWeight: '900', color: colors.bark[800],
  },
  codeBoxFilled: { borderColor: colors.paw[400] },
  codeBoxError: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 13, fontWeight: '600', marginTop: spacing.md },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  muted: { color: colors.bark[400], fontSize: 14 },
  link: { color: colors.paw[600], fontWeight: '800', fontSize: 14 },
  hint: { color: colors.bark[300], fontSize: 12, textAlign: 'center', marginTop: spacing.xxl, lineHeight: 18 },
})
