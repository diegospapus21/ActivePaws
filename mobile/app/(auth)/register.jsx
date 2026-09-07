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

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Ingresa tu nombre completo.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo electrónico inválido.'
    if (form.username.trim().length < 3) e.username = 'El usuario debe tener al menos 3 caracteres.'
    if (form.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.'
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
      })
      showToast(res.message || 'Cuenta creada. Revisa tu correo.', 'success')
      router.replace({ pathname: '/(auth)/verify', params: { email: form.email.trim().toLowerCase() } })
    } catch (err) {
      showToast(err.message || 'No se pudo crear la cuenta.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitle}>
            Crea tu cuenta para comprar, seguir tus pedidos y dejar reseñas. Te enviaremos un código de verificación a tu correo.
          </Text>

          <Field label="Nombre completo" icon="person-outline" placeholder="Diego Hernández" value={form.name} onChangeText={set('name')} error={errors.name} />
          <Field label="Correo electrónico" icon="mail-outline" placeholder="tucorreo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={form.email} onChangeText={set('email')} error={errors.email} />
          <Field label="Usuario" icon="at-outline" placeholder="diegoh" autoCapitalize="none" autoCorrect={false} value={form.username} onChangeText={set('username')} error={errors.username} />
          <Field
            label="Contraseña"
            icon="lock-closed-outline"
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={!showPass}
            value={form.password}
            onChangeText={set('password')}
            error={errors.password}
            right={
              <Pressable onPress={() => setShowPass((s) => !s)} hitSlop={8}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.bark[400]} />
              </Pressable>
            }
          />
          <Field label="Confirmar contraseña" icon="lock-closed-outline" placeholder="Repite tu contraseña" secureTextEntry={!showPass} value={form.confirm} onChangeText={set('confirm')} error={errors.confirm} />

          <Button title="Crear cuenta" icon="checkmark-circle-outline" onPress={onSubmit} loading={loading} />

          <View style={styles.loginRow}>
            <Text style={styles.muted}>¿Ya tienes cuenta? </Text>
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.link}>Inicia sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  scroll: { padding: spacing.xl },
  subtitle: { color: colors.bark[500], fontSize: 14, lineHeight: 20, marginBottom: spacing.xl },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  muted: { color: colors.bark[400], fontSize: 14 },
  link: { color: colors.paw[600], fontWeight: '800', fontSize: 14 },
})
