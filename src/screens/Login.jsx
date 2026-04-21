import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ user: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo: admin goes to admin dashboard
    if (form.user === 'admin') navigate('/admin')
    else navigate('/')
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

        <h1 className="font-display text-xl text-bark-800 font-semibold">Inicio de Sesion</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">Usuario:</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              className="input-field"
              value={form.user}
              onChange={e => setForm({ ...form, user: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-bark-700 mb-1 block">Contraseña:</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-1">
            Iniciar Sesion
          </button>
          <p className="text-center text-xs text-bark-400 -mt-1">
            <button type="button" className="hover:text-paw-600 transition-colors">¿Olvidaste tu contraseña?</button>
          </p>
        </form>

        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-2 text-bark-300">
            <div className="flex-1 h-px bg-cream-300" />
            <span className="text-xs">o</span>
            <div className="flex-1 h-px bg-cream-300" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 border border-cream-300 rounded-lg py-2 text-xs text-bark-600 hover:bg-cream-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              Iniciar Sesion con Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-cream-300 rounded-lg py-2 text-xs text-bark-600 hover:bg-cream-50 transition-colors">
              <img src="https://www.svgrepo.com/show/362013/apple.svg" alt="Apple" className="w-4 h-4" />
              Iniciar Sesion con Apple
            </button>
          </div>
        </div>

        <p className="text-xs text-bark-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-paw-600 font-semibold hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
