import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate       = useNavigate()
  const { login }      = useAuth()
  const { showToast }  = useToast()

  // ── React Hook Form ────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ defaultValues: { username: '', password: '' } })

  // ── Envío del formulario ───────────────────────────────────────────────────
  const onSubmit = async (data) => {
    const result = await login(data.username, data.password)

    if (!result.ok) {
      if (result.reason === 'unverified') {
        showToast(result.message, 'warning')
        navigate(`/verificar?email=${encodeURIComponent(result.email || '')}`)
        return
      }
      setError('password', { type: 'manual', message: result.message })
      showToast(result.message, 'error')
      return
    }

    showToast('¡Bienvenido de nuevo!', 'success')
    navigate(result.user.role === 'admin' ? '/admin' : '/')
  }

  return (
    <div className="min-h-screen bg-cream-100 paw-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center gap-5">

        {/* Logo */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-16 h-16 rounded-full bg-paw-50 border-2 border-paw-300 flex items-center justify-center">
            <span className="font-cursive text-2xl text-paw-600">AP</span>
          </div>
          <span className="font-cursive text-sm text-bark-500">ActivePaws</span>
        </div>

        <div className="w-10 h-0.5 bg-paw-300" />
        <h1 className="font-display text-xl text-bark-800 font-semibold">Inicio de Sesión</h1>

        {/* ── Formulario con React Hook Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4" noValidate>

          {/* Campo: Usuario */}
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">
              Usuario:
            </label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              className={`input-field ${errors.username ? 'border-red-400 focus:border-red-400' : ''}`}
              {...register('username', {
                required: 'El usuario es obligatorio.',
                minLength: { value: 3, message: 'Mínimo 3 caracteres.' },
              })}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-bark-700 block">
                Contraseña:
              </label>
              <Link to="/recuperar" className="text-xs text-paw-600 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className={`input-field ${errors.password ? 'border-red-400 focus:border-red-400' : ''}`}
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full mt-1 disabled:opacity-60"
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>

          {/* Credenciales de prueba */}
          <div className="bg-cream-100 rounded-lg p-3 text-xs text-bark-500 space-y-1">
            <p className="font-semibold text-bark-600">Credenciales de prueba:</p>
            <p> Admin: <b>admin</b> / <b>admin123</b></p>
            <p> Cliente: <b>luism</b> / <b>password123</b></p>
          </div>

        </form>

        <p className="text-xs text-bark-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-paw-600 font-semibold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
