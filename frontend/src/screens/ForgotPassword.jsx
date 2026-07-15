import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

export default function ForgotPassword() {
  const { showToast } = useToast()
  const [sent, setSent] = useState(false)
  const [devUrl, setDevUrl] = useState(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/forgot-password', { email: data.email }, { auth: false })
      setSent(true)
      setDevUrl(res.devResetUrl || null)
      showToast(res.message, 'success')
    } catch (err) {
      showToast(err.message || 'No se pudo procesar la solicitud.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 paw-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center gap-5">
        <h1 className="font-display text-xl text-bark-800 font-semibold">Recuperar contraseña</h1>
        <p className="text-xs text-bark-500 text-center -mt-3">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="w-full flex flex-col gap-3 text-center">
            <p className="text-sm text-bark-600">
              Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.
            </p>
            {devUrl && (
              <div className="bg-cream-100 rounded-lg p-3 text-xs text-bark-500 break-all">
                <p className="font-semibold text-bark-600 mb-1">Modo desarrollo — enlace directo:</p>
                <Link to={devUrl.replace(window.location.origin, '')} className="text-paw-600 underline">
                  {devUrl}
                </Link>
              </div>
            )}
            <Link to="/login" className="btn-secondary w-full">Volver a iniciar sesión</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4" noValidate>
            <div>
              <label className="text-sm font-semibold text-bark-700 mb-1 block">Correo electrónico:</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                {...register('email', {
                  required: 'El correo es obligatorio.',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Ingresa un correo válido.' },
                })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
            <p className="text-center text-xs text-bark-400">
              <Link to="/login" className="text-paw-600 font-semibold hover:underline">Volver a iniciar sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
