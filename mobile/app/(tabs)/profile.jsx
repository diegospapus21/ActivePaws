import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useAuth } from '../../src/context/AuthContext'
import { useCart } from '../../src/context/CartContext'
import { useToast } from '../../src/context/ToastContext'
import { Button, EmptyState, StatusBadge } from '../../src/components/ui'
import { colors, radii, spacing, shadow } from '../../src/theme/theme'
import { initials } from '../../src/utils/format'

export default function Profile() {
  const router = useRouter()
  const { user, isLogged, logout, resendCode, refreshUser } = useAuth()
  const { clearCart } = useCart()
  const { showToast } = useToast()

  if (!isLogged) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="person-circle-outline"
          title="No has iniciado sesión"
          subtitle="Inicia sesión o crea una cuenta para gestionar tu perfil, pedidos y reseñas."
          action={
            <View style={{ gap: 10, alignSelf: 'stretch', width: 240 }}>
              <Button title="Iniciar sesión" icon="log-in-outline" onPress={() => router.push('/(auth)/login')} />
              <Button title="Crear cuenta" variant="outline" onPress={() => router.push('/(auth)/register')} />
            </View>
          }
        />
      </View>
    )
  }

  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await logout()
          showToast('Sesión cerrada.', 'info')
          router.replace('/(tabs)')
        },
      },
    ])
  }

  const onResend = async () => {
    try {
      await resendCode(user.email)
      showToast('Te enviamos un nuevo código de verificación.', 'info')
      router.push({ pathname: '/(auth)/verify', params: { email: user.email } })
    } catch (err) {
      showToast(err.message || 'No se pudo reenviar el código.', 'error')
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      {/* Encabezado del perfil */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(user.name)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={{ marginTop: 8 }}>
          <StatusBadge status={user.status} />
        </View>
      </View>

      {/* Aviso de verificación */}
      {!user.emailConfirmed && (
        <View style={styles.verifyCard}>
          <Ionicons name="alert-circle" size={22} color={colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={styles.verifyTitle}>Correo sin verificar</Text>
            <Text style={styles.verifySub}>Verifica tu correo para poder comprar y dejar reseñas.</Text>
          </View>
          <Pressable onPress={onResend} style={styles.verifyBtn}>
            <Text style={styles.verifyBtnText}>Verificar</Text>
          </Pressable>
        </View>
      )}

      {/* Detalles de la cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <InfoRow icon="at-outline" label="Usuario" value={user.username} />
        <InfoRow icon="shield-checkmark-outline" label="Rol" value={user.role === 'admin' ? 'Administrador' : 'Cliente'} />
        <InfoRow
          icon="mail-outline"
          label="Correo"
          value={user.emailConfirmed ? 'Verificado' : 'Sin verificar'}
          valueColor={user.emailConfirmed ? colors.success : colors.warning}
        />
      </View>

      {/* Accesos rápidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad</Text>
        <ActionRow icon="receipt-outline" label="Mis pedidos" onPress={() => router.push('/(tabs)/orders')} />
        <ActionRow icon="cart-outline" label="Mi carrito" onPress={() => router.push('/(tabs)/cart')} />
        <ActionRow icon="refresh-outline" label="Actualizar mis datos" onPress={async () => { await refreshUser(); showToast('Datos actualizados.', 'success') }} />
      </View>

      <Button title="Cerrar sesión" variant="danger" icon="log-out-outline" onPress={confirmLogout} style={{ marginTop: spacing.lg }} />

      <Text style={styles.version}>ActivePaws móvil · v1.0.0</Text>
    </ScrollView>
  )
}

function InfoRow({ icon, label, value, valueColor }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={18} color={colors.bark[400]} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  )
}

function ActionRow({ icon, label, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.actionRow, pressed && { backgroundColor: colors.cream[100] }]} onPress={onPress}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={20} color={colors.paw[600]} />
        <Text style={styles.actionLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.bark[300]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream[50] },
  header: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: colors.paw[500],
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, ...shadow.floating,
  },
  avatarText: { color: colors.white, fontSize: 32, fontWeight: '900' },
  name: { fontSize: 22, fontWeight: '900', color: colors.bark[800] },
  email: { fontSize: 14, color: colors.bark[400], marginTop: 2 },
  verifyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.paw[50],
    borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.paw[200], marginBottom: spacing.lg,
  },
  verifyTitle: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  verifySub: { fontSize: 12, color: colors.bark[500], marginTop: 2 },
  verifyBtn: { backgroundColor: colors.paw[500], paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill },
  verifyBtnText: { color: colors.white, fontWeight: '800', fontSize: 12 },
  section: {
    backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cream[200], marginBottom: spacing.lg, ...shadow.card,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: colors.bark[400], textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, paddingHorizontal: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoLabel: { fontSize: 14, color: colors.bark[500], fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '800', color: colors.bark[700] },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderRadius: radii.md },
  actionLabel: { fontSize: 15, fontWeight: '700', color: colors.bark[700] },
  version: { textAlign: 'center', color: colors.bark[300], fontSize: 12, marginTop: spacing.xl },
})
