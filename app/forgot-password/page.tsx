'use client'

import { useState } from 'react'
import { supabase } from '../supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function handleReset() {
    setCargando(true)
    setMensaje('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://compinero.es/reset-password',
    })

    if (error) {
      setMensaje('Ha ocurrido un error. Comprueba el email.')
    } else {
      setEnviado(true)
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">

      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <a href="/login" className="text-white text-sm">← Volver</a>
        <h1 className="text-white font-bold text-lg">Recuperar contraseña</h1>
      </header>

      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full flex flex-col justify-center">

        {enviado ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-[#1A5FAF] font-bold text-2xl mb-2">Revisa tu email</h2>
            <p className="text-gray-500 text-sm">Te hemos enviado un enlace para restablecer tu contraseña.</p>
          </div>
        ) : (
          <>
            <h2 className="text-[#1A5FAF] font-bold text-2xl mb-2">¿Olvidaste tu contraseña?</h2>
            <p className="text-gray-500 text-sm mb-8">Introduce tu email y te enviamos un enlace para recuperarla.</p>

            <div className="mb-6">
              <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]"
              />
            </div>

            {mensaje && (
              <div className="p-4 rounded-xl text-sm mb-4 bg-red-50 text-red-600">
                {mensaje}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={cargando}
              className="w-full bg-[#1A5FAF] text-white font-bold py-4 rounded-full text-base disabled:opacity-50"
            >
              {cargando ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}