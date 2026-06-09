import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const navigate      = useNavigate()
  const { showToast } = useToast()

  // ── React Hook Form ────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '', email: '', username: '',
      password: '', confirmPassword: '', terms: false,
    },
  })

  // watch('password') permite comparar con confirmPassword
  const passwordValue = watch('password')

  // ── Envío del formulario ───────────────────────────────────────────────────
  const onSubmit = (data) => {
    // Aquí iría la llamada al API. Por ahora simulamos con un delay.
    console.log('Nuevo usuario registrado:', data)
    showToast('¡Cuenta creada exitosamente!', 'success')
    navigate('/login')
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
        <h1 className="font-display text-xl text-bark-800 font-semibold">Crear cuenta</h1>
        <p className="text-xs text-bark-500 text-center -mt-3">
          Crea una cuenta para comprar en ActivePaws.
        </p>

        {/* ── Formulario con React Hook Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4" noValidate>

          {/* Nombre completo */}
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">
              Nombre completo:
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              {...register('name', {
                required: 'El nombre es obligatorio.',
                minLength: { value: 3, message: 'Mínimo 3 caracteres.' },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">
              Correo electrónico:
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className={`input-field ${errors.email ? 'border-red-400' : ''}`}
              {...register('email', {
                required: 'El correo es obligatorio.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Ingresa un correo válido.',
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Usuario */}
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">
              Nombre de usuario:
            </label>
            <input
              type="text"
              placeholder="juanperez123"
              className={`input-field ${errors.username ? 'border-red-400' : ''}`}
              {...register('username', {
                required: 'El usuario es obligatorio.',
                minLength: { value: 4, message: 'Mínimo 4 caracteres.' },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Solo letras, números y guión bajo.',
                },
              })}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">
              Contraseña:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input-field ${errors.password ? 'border-red-400' : ''}`}
              {...register('password', {
                required: 'La contraseña es obligatoria.',
                minLength: { value: 6, message: 'Mínimo 6 caracteres.' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[0-9])/,
                  message: 'Debe contener al menos una letra y un número.',
                },
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">
              Confirmar contraseña:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`}
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña.',
                validate: value =>
                  value === passwordValue || 'Las contraseñas no coinciden.',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Términos y condiciones */}
          <label className="flex items-start gap-2 text-xs text-bark-500 cursor-pointer">
            <input
              type="checkbox"
              className="accent-paw-500 mt-0.5"
              {...register('terms', {
                required: 'Debes aceptar los términos y condiciones.',
              })}
            />
            <span>
              Acepto los{' '}
              <span className="text-paw-600 underline cursor-pointer">
                Términos y condiciones
              </span>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 -mt-3">{errors.terms.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <p className="text-center text-xs text-bark-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-paw-600 font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}
