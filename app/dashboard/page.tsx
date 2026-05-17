'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Dashboard() {
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login'
      } else {
        setUsuario(data.user)
      }
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!usuario) return (
    <div className="min-h-screen bg-[#F4F8FF] flex items-center justify-center">
      <p className="text-[#1A5FAF]">Cargando...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">

      {/* HEADER */}
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="Compiñero" className="h-10 w-auto" />
        <button
          onClick={handleLogout}
          className="text-white text-sm border border-white px-3 py-1 rounded-full"
        >
          Salir
        </button>
      </header>

      <div className="px-6 py-8 max-w-md mx-auto w-full">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D0E4F7] mb-6">
          <p className="text-gray-400 text-xs mb-1">Bienvenido</p>
          <p className="text-[#1A5FAF] font-bold text-lg">
            {usuario.user_metadata?.nombre || usuario.email}
          </p>
          <span className="inline-block mt-2 bg-[#E8F5E2] text-[#2D6A4F] text-xs font-bold px-3 py-1 rounded-full">
            {usuario.user_metadata?.tipo === 'tecnico' ? '🎾 Técnico / Entrenador' : '👨‍👧 Progenitor / Tutor'}
          </span>
        </div>

        <h2 className="text-[#1A5FAF] font-bold text-lg mb-4">¿Qué quieres hacer?</h2>

        <div className="flex flex-col gap-3">
  <a href="/perfil-jugador" className="bg-white border-2 border-[#1A5FAF] rounded-2xl p-5 text-left">
    <p className="text-[#1A5FAF] font-bold text-base mb-1">👤 Crear perfil de jugador</p>
    <p className="text-gray-400 text-sm">Añade los datos de tu hijo/a o jugador</p>
  </a>

  <a href="/apuntarse" className="bg-white border-2 border-[#D0E4F7] rounded-2xl p-5 text-left">
    <p className="text-[#1A5FAF] font-bold text-base mb-1">🏆 Buscar pareja para torneo</p>
    <p className="text-gray-400 text-sm">Apúntate a un torneo y encuentra pareja</p>
  </a>

          <button className="bg-white border-2 border-[#D0E4F7] rounded-2xl p-5 text-left opacity-50">
            <p className="text-[#1A5FAF] font-bold text-base mb-1">💬 Mis mensajes</p>
            <p className="text-gray-400 text-sm">No tienes mensajes todavía</p>
          </button>
        </div>

      </div>
    </main>
  )
}