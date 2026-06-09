import { createContext, useContext, useState, useCallback } from 'react'

// ─── Contexto de notificaciones (toasts) ─────────────────────────────────────
// Permite mostrar alertas visuales desde cualquier componente con:
//   const { showToast } = useToast()
//   showToast('Producto guardado', 'success')

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  /**
   * @param {string} message   - Texto a mostrar
   * @param {'success'|'error'|'info'|'warning'} type
   * @param {number} duration  - Milisegundos antes de ocultarse (default 3000)
   */
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ── Contenedor de toasts (esquina inferior derecha) ── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ─── Componente visual de cada toast ─────────────────────────────────────────
const STYLES = {
  success: 'bg-green-500  text-white',
  error:   'bg-red-500    text-white',
  info:    'bg-blue-500   text-white',
  warning: 'bg-amber-500  text-white',
}

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

function ToastItem({ toast, onClose }) {
  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
        min-w-[220px] max-w-xs animate-fade-in
        ${STYLES[toast.type] || STYLES.info}
      `}
    >
      <span className="text-lg font-bold">{ICONS[toast.type]}</span>
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white text-xs ml-1 font-bold"
      >
        ✕
      </button>
    </div>
  )
}

// Hook de acceso rápido
export const useToast = () => useContext(ToastContext)
