import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../../src/context/AuthContext'
import { useToast } from '../../src/context/ToastContext'
import { Button, Field } from '../../src/components/ui'
import { colors, spacing } from '../../src/theme/theme'

export default function Login() {
  const router = useRouter()
  const { login, resendCode } = useAuth()
  const { showToast } = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async () => {
    setError('')
    if (!username.trim() || !password) {
      setError('Ingresa tu usuario y contraseña.')
      return
    }
    setLoading(true)
    try {
      await login(username.trim(), password)
      showToast('¡Bienvenido de vuelta! 🐾', 'success')
      router.replace('/(tabs)')
    } catch (err) {
      // Correo no verificado -> lo mandamos a la pantalla de verificación
      if (err?.data?.code === 'EMAIL_NOT_VERIFIED') {
        try { await resendCode(err.data.email) } catch { /* noop */ }
        showToast('Debes verificar tu correo. Te enviamos un nuevo código.', 'warning')
        router.push({ pathname: '/(auth)/verify', params: { email: err.data.email } })
        return
      }
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="paw" size={40} color={colors.white} />
            </View>
            <Text style={styles.brand}>ActivePaws</Text>
            <Text style={styles.tagline}>Ropa y accesorios para tus mascotas</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <Field
              label="Usuario"
              icon="person-outline"
              placeholder="tu_usuario"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />
            <Field
              label="Contraseña"
              icon="lock-closed-outline"
              placeholder="••••••••"
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
              right={
                <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.bark[400]} />
                </Pressable>
              }
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: spacing.lg }}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <Button title="Entrar" icon="log-in-outline" onPress={onSubmit} loading={loading} />

            <View style={styles.registerRow}>
              <Text style={styles.muted}>¿No tienes cuenta? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.link}>Regístrate</Text>
              </Pressable>
            </View>

            <Pressable onPress={() => router.replace('/(tabs)')} style={styles.guest}>
              <Text style={styles.guestText}>Explorar como invitado</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.bark[500]} />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  logoCircle: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.paw[500],
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  brand: { fontSize: 30, fontWeight: '900', color: colors.bark[800] },
  tagline: { fontSize: 14, color: colors.bark[400], marginTop: 2 },
  form: {},
  title: { fontSize: 22, fontWeight: '900', color: colors.bark[800], marginBottom: spacing.xl },
  error: { color: colors.error, fontSize: 13, fontWeight: '600', marginBottom: spacing.md },
  link: { color: colors.paw[600], fontWeight: '800', fontSize: 14 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  muted: { color: colors.bark[400], fontSize: 14 },
  guest: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.xl },
  guestText: { color: colors.bark[500], fontWeight: '700' },
})
