import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const navigate      = useNavigate()
  const { register: registerUser, verifyCode, resendCode } = useAuth()
  const { showToast } = useToast()

  const [pendingEmail, setPendingEmail] = useState(null) // correo en espera de verificación
  const [emailSent, setEmailSent] = useState(true)
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const codeInputRef = useRef(null)

  // ── React Hook Form (formulario de registro) ────────────────────────────────
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

  const passwordValue = watch('password')

  const onSubmit = async (data) => {
    const result = await registerUser({
      name: data.name, email: data.email, username: data.username, password: data.password,
    })

    if (!result.ok) {
      showToast(result.message, 'error')
      return
    }

    showToast(result.message, result.emailSent ? 'success' : 'warning')
    setEmailSent(result.emailSent)
    setPendingEmail(result.email)
  }

  // ── Verificación del código de 6 dígitos ────────────────────────────────────
  const handleVerify = async () => {
    if (code.trim().length !== 6) {
      showToast('Ingresa el código de 6 dígitos.', 'error')
      return
    }
    setVerifying(true)
    const result = await verifyCode(pendingEmail, code.trim())
    setVerifying(false)

    if (!result.ok) {
      showToast(result.message, 'error')
      return
    }

    showToast(result.message, 'success')
    navigate('/login')
  }

  const handleResend = async () => {
    setResending(true)
    const result = await resendCode(pendingEmail)
    setResending(false)
    showToast(result.message, result.ok ? 'success' : 'error')
  }

  // ── Pantalla de verificación de código ──────────────────────────────────────
  if (pendingEmail) {
    return (
      <div className="min-h-screen bg-cream-100 paw-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-paw-50 border-2 border-paw-300 flex items-center justify-center text-2xl">
            📩
          </div>
          <h1 className="font-display text-xl text-bark-800 font-semibold">Verifica tu correo</h1>
          <p className="text-sm text-bark-500">
            Enviamos un código de 6 dígitos a <b>{pendingEmail}</b>. Ingrésalo para activar tu cuenta.
          </p>
          {!emailSent && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">
              El servidor no tiene configurado el envío real de correos (SMTP). Pide al administrador
              que revise la consola del backend para ver el código, o configure las variables SMTP.
            </p>
          )}

          <input
            ref={codeInputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="input-field text-center text-2xl tracking-[0.5em] font-bold"
          />

          <button
            onClick={handleVerify}
            disabled={verifying || code.length !== 6}
            className="btn-primary w-full disabled:opacity-60"
          >
            {verifying ? 'Verificando...' : 'Verificar cuenta'}
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="text-xs text-paw-600 font-semibold hover:underline disabled:opacity-60"
          >
            {resending ? 'Reenviando...' : '¿No te llegó? Reenviar código'}
          </button>

          <Link to="/login" className="text-xs text-bark-400 hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    )
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
