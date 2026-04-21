import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ user: '', password: '', confirm: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
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

        <h1 className="font-display text-xl text-bark-800 font-semibold">Registrarse</h1>
        <p className="text-xs text-bark-500 text-center -mt-3">Crea una cuenta para administrar y gestionar usuarios fácilmente.</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">Usuario:</label>
            <input type="text" placeholder="Tu nombre de usuario" className="input-field"
              value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">Contraseña:</label>
            <input type="password" placeholder="••••••••" className="input-field"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">Confirmar Contraseña:</label>
            <input type="password" placeholder="••••••••" className="input-field"
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-xs text-bark-500">
            <input type="checkbox" className="accent-paw-500" />
            Aceptar <span className="text-paw-600 underline cursor-pointer">Términos y condiciones</span>
          </label>
          <button type="submit" className="btn-primary w-full">Crear Cuenta</button>
          <p className="text-center text-xs text-bark-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-paw-600 font-semibold hover:underline">Iniciar sesión</Link>
          </p>
        </form>

        <div className="w-full flex flex-col gap-2">
          <p className="text-center text-xs text-bark-400">O registrarse con</p>
          <div className="flex justify-center gap-4">
            <button className="w-10 h-10 border border-cream-300 rounded-full flex items-center justify-center hover:bg-cream-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 border border-cream-300 rounded-full flex items-center justify-center hover:bg-cream-50 transition-colors">
              <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 border border-cream-300 rounded-full flex items-center justify-center hover:bg-cream-50 transition-colors">
              <img src="https://www.svgrepo.com/show/362013/apple.svg" alt="Apple" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
