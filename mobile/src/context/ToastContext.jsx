import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, radii, shadow } from '../theme/theme'

// ─── Contexto de Toasts (notificaciones flotantes) ─────────────────────────────

const ToastContext = createContext(null)

const ICONS = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'warning',
}
const TINTS = {
  success: colors.success,
  error: colors.error,
  info: colors.info,
  warning: colors.warning,
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const opacity = useRef(new Animated.Value(0)).current
  const timer = useRef(null)

  const showToast = useCallback((message, type = 'info') => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ message, type })
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setToast(null))
    }, 2800)
  }, [opacity])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
          <View style={styles.toast}>
            <Ionicons name={ICONS[toast.type] || ICONS.info} size={22} color={TINTS[toast.type] || TINTS.info} />
            <Text style={styles.text} numberOfLines={3}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext) || { showToast: () => {} }

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 96,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.lg,
    maxWidth: '100%',
    ...shadow.floating,
  },
  text: { flex: 1, color: colors.bark[700], fontSize: 14, fontWeight: '600' },
})
