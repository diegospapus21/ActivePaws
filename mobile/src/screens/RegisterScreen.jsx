import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Field, PasswordField } from '../components'
import { colors, spacing } from '../theme/theme'
import {
  collectErrors,
  validateAge,
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
} from '../utils/validators'

const EMPTY_FORM = { name: '', email: '', username: '', age: '', password: '', confirm: '' }

// Registro de clientes. Valida todos los campos antes de llamar a la API.
export default function RegisterScreen() {
  const router = useRouter()
  const { register } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Actualiza un campo y limpia su error
  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e = collectErrors({
      name: validateName(form.name),
      email: validateEmail(form.email),
      username: validateUsername(form.username),
      age: validateAge(form.age),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const email = form.email.trim().toLowerCase()
    try {
      const res = await register({
        name: form.name.trim(),
        email,
        username: form.username.trim(),
        age: Number(form.age),
        password: form.password,
      })
      showToast(res.message || 'Cuenta creada. Revisa tu correo.', 'success')
      setForm(EMPTY_FORM) // no dejar datos rezagados en el formulario
      router.replace({ pathname: '/(auth)/verify', params: { email } })
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
            label="Edad"
            icon="calendar-outline"
            placeholder="Ej. 18"
            keyboardType="number-pad"
            maxLength={3}
            value={form.age}
            onChangeText={(t) => set('age')(t.replace(/[^0-9]/g, ''))}
            error={errors.age}
          />
          <PasswordField label="Contraseña" placeholder="Mínimo 6 caracteres" value={form.password} onChangeText={set('password')} error={errors.password} />
          <PasswordField label="Confirmar contraseña" placeholder="Repite tu contraseña" value={form.confirm} onChangeText={set('confirm')} error={errors.confirm} />

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
