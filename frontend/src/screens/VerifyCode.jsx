import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function VerifyCode() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyCode, resendCode } = useAuth()
  const { showToast } = useToast()

  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)

  const handleVerify = async () => {
    if (!email.trim() || code.trim().length !== 6) {
      showToast('Ingresa tu correo y el código de 6 dígitos.', 'error')
      return
    }
    setVerifying(true)
    const result = await verifyCode(email.trim(), code.trim())
    setVerifying(false)

    if (!result.ok) {
      showToast(result.message, 'error')
      return
    }
    showToast(result.message, 'success')
    navigate('/login')
  }

  const handleResend = async () => {
    if (!email.trim()) {
      showToast('Ingresa tu correo primero.', 'error')
      return
    }
    setResending(true)
    const result = await resendCode(email.trim())
    setResending(false)
    showToast(result.message, result.ok ? 'success' : 'error')
  }

  return (
    <div className="min-h-screen bg-cream-100 paw-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-paw-50 border-2 border-paw-300 flex items-center justify-center text-2xl">
          📩
        </div>
        <h1 className="font-display text-xl text-bark-800 font-semibold">Verifica tu cuenta</h1>
        <p className="text-sm text-bark-500">
          Ingresa el código de 6 dígitos que enviamos a tu correo para poder iniciar sesión.
        </p>

        <div className="w-full text-left">
          <label className="text-sm font-semibold text-bark-700 mb-1 block">Correo electrónico:</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <input
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
          disabled={verifying || code.length !== 6 || !email.trim()}
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
