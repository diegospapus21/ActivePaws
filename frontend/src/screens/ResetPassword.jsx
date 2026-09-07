import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { api } from '../api/client'
import { useToast } from '../context/ToastContext'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [done, setDone] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  })
  const passwordValue = watch('password')

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/reset-password', { token, password: data.password }, { auth: false })
      setDone(true)
      showToast('Contraseña restablecida correctamente.', 'success')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      showToast(err.message || 'No se pudo restablecer la contraseña.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 paw-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center gap-5">
        <h1 className="font-display text-xl text-bark-800 font-semibold">Restablecer contraseña</h1>

        {done ? (
          <p className="text-sm text-bark-600 text-center">
            ¡Listo! Redirigiéndote al inicio de sesión...
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4" noValidate>
            <div>
              <label className="text-sm font-semibold text-bark-700 mb-1 block">Nueva contraseña:</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input-field ${errors.password ? 'border-red-400' : ''}`}
                {...register('password', {
                  required: 'La contraseña es obligatoria.',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                })}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-bark-700 mb-1 block">Confirmar contraseña:</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`}
                {...register('confirmPassword', {
                  required: 'Confirma tu contraseña.',
                  validate: value => value === passwordValue || 'Las contraseñas no coinciden.',
                })}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
              {isSubmitting ? 'Guardando...' : 'Restablecer contraseña'}
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
