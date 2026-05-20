'use client'

import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleLogin() {
    setCargando(true)
    setMensaje('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMensaje('Email o contraseña incorrectos.')
    } else {
      window.location.href = '/dashboard'
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">

      {/* HEADER */}
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <a href="/" className="text-white text-sm">← Volver</a>
        <h1 className="text-white font-bold text-lg">Iniciar sesión</h1>
      </header>

      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full flex flex-col justify-center">

        <h2 className="text-[#1A5FAF] font-bold text-2xl mb-2">Bienvenido de nuevo</h2>
        <p className="text-gray-500 text-sm mb-8">Entra en tu cuenta para buscar pareja de torneo.</p>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]"
            />
          </div>
          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]"
            />
          </div>
        </div>

        {mensaje && (
          <div className="p-4 rounded-xl text-sm mb-4 bg-red-50 text-red-600">
            {mensaje}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={cargando}
          className="w-full bg-[#1A5FAF] text-white font-bold py-4 rounded-full text-base disabled:opacity-50 mb-4"
        >
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="text-center text-gray-500 text-sm mb-3">
  <a href="/forgot-password" className="text-[#1A5FAF] font-bold">
    ¿Olvidaste tu contraseña?
  </a>
</p>

<p className="text-center text-gray-500 text-sm">
  ¿No tienes cuenta?{' '}
  <a href="/registro" className="text-[#5CB840] font-bold">
    Regístrate gratis
  </a>
</p>

      </div>
    </main>
  )
}