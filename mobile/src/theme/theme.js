// ─── Tema de ActivePaws ────────────────────────────────────────────────────────
// Paleta portada desde tailwind.config.js del frontend web para mantener la
// identidad visual: cream (fondos), paw (dorado / acento) y bark (marrón / texto).

export const colors = {
  cream: {
    50: '#fdf9f3',
    100: '#f5efe6',
    200: '#ede0d0',
    300: '#dfc9b0',
    400: '#ceaa87',
  },
  paw: {
    50: '#fdf8ec',
    100: '#f9edd0',
    200: '#f2d89e',
    300: '#e8be63',
    400: '#dfa530',
    500: '#c9891a',
    600: '#a86d12',
    700: '#875210',
    800: '#6e4115',
    900: '#5c3614',
  },
  bark: {
    50: '#f9f5f2',
    100: '#ede5dc',
    200: '#d8c9b8',
    300: '#bea48e',
    400: '#a07e63',
    500: '#8c6448',
    600: '#714e38',
    700: '#5c3d2e',
    800: '#4a3126',
    900: '#3d2820',
  },
  white: '#ffffff',
  black: '#000000',
  // Estados de pedidos / usuarios
  status: {
    pendingBg: '#fef3c7', pendingText: '#b45309',
    sentBg: '#dbeafe', sentText: '#1d4ed8',
    deliveredBg: '#dcfce7', deliveredText: '#15803d',
    cancelledBg: '#fee2e2', cancelledText: '#dc2626',
    activeBg: '#dcfce7', activeText: '#15803d',
    inactiveBg: '#fee2e2', inactiveText: '#dc2626',
  },
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',
}

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
}

export const radii = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999,
}

export const shadow = {
  card: {
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  floating: {
    shadowColor: '#5c3d2e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
}

// Etiqueta de estado -> colores
export function statusStyle(status) {
  switch (status) {
    case 'Pendiente': return { bg: colors.status.pendingBg, text: colors.status.pendingText }
    case 'Enviado': return { bg: colors.status.sentBg, text: colors.status.sentText }
    case 'Entregado': return { bg: colors.status.deliveredBg, text: colors.status.deliveredText }
    case 'Cancelado': return { bg: colors.status.cancelledBg, text: colors.status.cancelledText }
    case 'Activo': return { bg: colors.status.activeBg, text: colors.status.activeText }
    case 'Inactivo': return { bg: colors.status.inactiveBg, text: colors.status.inactiveText }
    default: return { bg: colors.cream[200], text: colors.bark[600] }
  }
}
