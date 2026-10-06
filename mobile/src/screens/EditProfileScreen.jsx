import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native'
import { Redirect, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Card, Field, Loading, PasswordField, SectionTitle } from '../components'
import { colors, spacing } from '../theme/theme'
import {
  collectErrors,
  validateAge,
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
  validateUsername,
} from '../utils/validators'

// Edición del perfil del usuario logueado (datos + cambio opcional de contraseña).
// Espera a que cargue la sesión y luego muestra el formulario con los datos actuales.
export default function EditProfileScreen() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Redirect href="/(auth)/login" />
  return <EditProfileForm user={user} />
}

function EditProfileForm({ user }) {
  const router = useRouter()
  const { updateProfile } = useAuth()
  const { showToast } = useToast()

  // El formulario arranca con los datos actuales del usuario
  const [form, setForm] = useState(() => ({
    name: user.name || '',
    email: user.email || '',
    username: user.username || '',
    age: user.age ? String(user.age) : '',
    phone: user.phone || '',
    currentPassword: '',
    newPassword: '',
    confirm: '',
  }))
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const wantsPasswordChange = Boolean(form.currentPassword || form.newPassword || form.confirm)

  const validate = () => {
    const e = collectErrors({
      name: validateName(form.name),
      email: validateEmail(form.email),
      username: validateUsername(form.username),
      age: validateAge(form.age),
      phone: validatePhone(form.phone, { required: false }),
      ...(wantsPasswordChange && {
        currentPassword: form.currentPassword ? '' : 'Ingresa tu contraseña actual.',
        newPassword: validatePassword(form.newPassword),
        confirm: validateConfirm(form.newPassword, form.confirm),
      }),
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        age: Number(form.age),
        phone: form.phone.trim(),
      }
      if (wantsPasswordChange) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }
      const res = await updateProfile(payload)
      // Limpiamos los campos de contraseña para no dejar valores rezagados
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirm: '' }))
      showToast(res.message || 'Perfil actualizado.', 'success')
      router.back()
    } catch (err) {
      showToast(err.message || 'No se pudo actualizar el perfil.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <SectionTitle style={{ marginTop: 0 }}>Datos personales</SectionTitle>
          <Field label="Nombre completo" icon="person-outline" value={form.name} onChangeText={set('name')} error={errors.name} />
          <Field label="Correo electrónico" icon="mail-outline" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={form.email} onChangeText={set('email')} error={errors.email} />
          <Field label="Usuario" icon="at-outline" autoCapitalize="none" autoCorrect={false} value={form.username} onChangeText={set('username')} error={errors.username} />
          <Field
            label="Edad"
            icon="calendar-outline"
            keyboardType="number-pad"
            maxLength={3}
            value={form.age}
            onChangeText={(t) => set('age')(t.replace(/[^0-9]/g, ''))}
            error={errors.age}
          />
          <Field label="Teléfono (opcional)" icon="call-outline" keyboardType="phone-pad" placeholder="7000-0000" value={form.phone} onChangeText={set('phone')} error={errors.phone} />

          <SectionTitle>Cambiar contraseña</SectionTitle>
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={styles.hint}>Déjalo en blanco si no quieres cambiarla.</Text>
            <PasswordField label="Contraseña actual" value={form.currentPassword} onChangeText={set('currentPassword')} error={errors.currentPassword} />
            <PasswordField label="Nueva contraseña" placeholder="Mínimo 6 caracteres" value={form.newPassword} onChangeText={set('newPassword')} error={errors.newPassword} />
            <PasswordField label="Confirmar nueva contraseña" value={form.confirm} onChangeText={set('confirm')} error={errors.confirm} />
          </Card>

          <Button title="Guardar cambios" icon="save-outline" onPress={onSave} loading={loading} />
          <Button title="Cancelar" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream[50] },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  hint: { fontSize: 13, color: colors.bark[400], marginBottom: spacing.md },
})
