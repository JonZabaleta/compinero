'use client'

import { useState } from 'react'
import { supabase } from '../supabase'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('progenitor')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleRegistro() {
    setCargando(true)
    setMensaje('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, tipo }
      }
    })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setMensaje('¡Registro completado! Revisa tu email para confirmar tu cuenta.')
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">

      {/* HEADER */}
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <a href="/" className="text-white text-sm">← Volver</a>
        <h1 className="text-white font-bold text-lg">Crear cuenta</h1>
      </header>

      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">

        <h2 className="text-[#1A5FAF] font-bold text-2xl mb-2">Bienvenido a Compiñero</h2>
        <p className="text-gray-500 text-sm mb-8">Crea tu cuenta gratuita para empezar a buscar pareja de torneo.</p>

        {/* Tipo de usuario */}
        <div className="mb-6">
          <p className="text-[#1A5FAF] font-bold text-sm mb-3">Soy...</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTipo('progenitor')}
              className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                tipo === 'progenitor'
                  ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white'
                  : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
              }`}
            >
              👨‍👧 Progenitor / Tutor
            </button>
            <button
              onClick={() => setTipo('tecnico')}
              className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                tipo === 'tecnico'
                  ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white'
                  : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
              }`}
            >
              🎾 Técnico / Entrenador
            </button>
          </div>
        </div>

        {/* Campos */}
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre y apellidos"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]"
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]"
            />
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className={`p-4 rounded-xl text-sm mb-4 ${
            mensaje.includes('Error')
              ? 'bg-red-50 text-red-600'
              : 'bg-[#E8F5E2] text-[#2D6A4F]'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleRegistro}
          disabled={cargando}
          className="w-full bg-[#5CB840] text-white font-bold py-4 rounded-full text-base disabled:opacity-50"
        >
          {cargando ? 'Creando cuenta...' : 'Crear cuenta gratis'}
        </button>

        <p className="text-center text-gray-400 text-xs mt-6">
          Al registrarte aceptas nuestros términos de uso y política de privacidad conforme al RGPD.
        </p>

      </div>
    </main>
  )
}