'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const CATEGORIAS = ['Benjamin', 'Alevin', 'Infantil', 'Cadete', 'Junior']
const ETIQUETAS: {[key:string]:string} = {
  'Benjamin':'Benjamín', 'Alevin':'Alevín', 'Junior':'Júnior'
}

export default function Apuntarse() {
  const [torneos, setTorneos] = useState<any[]>([])
  const [jugadores, setJugadores] = useState<any[]>([])
  const [torneoSeleccionado, setTorneoSeleccionado] = useState<any>(null)
  const [categoria, setCategoria] = useState('')
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<any>(null)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: torn } = await supabase.from('torneos').select('*').eq('activo', true)
      if (torn) setTorneos(torn)

      const { data: jugs } = await supabase.from('jugadores').select('*').eq('user_id', user.id)
      if (jugs) setJugadores(jugs)
    }
    cargar()
  }, [])

  async function handleApuntarse() {
    if (!torneoSeleccionado || !categoria || !jugadorSeleccionado) return
    setCargando(true)
    setMensaje('')

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('inscripciones').insert({
      user_id: user?.id,
      jugador_id: jugadorSeleccionado.id,
      torneo_id: torneoSeleccionado.id,
      categoria,
      busca_pareja: true
    })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setMensaje('¡Te has apuntado! Ya apareces en la búsqueda.')
      setTimeout(() => window.location.href = '/buscar', 2000)
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <a href="/dashboard" className="text-white text-sm">← Volver</a>
        <h1 className="text-white font-bold text-lg">Apuntarse a torneo</h1>
      </header>

      <div className="px-6 py-8 max-w-md mx-auto w-full flex flex-col gap-6">
        <p className="text-gray-500 text-sm">Elige torneo, categoría y jugador para aparecer en la búsqueda de pareja.</p>

        {/* Selector jugador */}
        <div>
          <label className="text-[#1A5FAF] font-bold text-sm mb-2 block">¿Para qué jugador?</label>
          {jugadores.length === 0 ? (
            <div className="bg-[#FFF8E6] border border-[#F0C040] rounded-xl p-4">
              <p className="text-sm text-[#854F0B]">Primero debes <a href="/perfil-jugador" className="font-bold underline">crear un perfil de jugador</a>.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {jugadores.map(j => (
                <button key={j.id} onClick={() => setJugadorSeleccionado(j)}
                  className={`p-4 rounded-2xl border-2 text-left ${
                    jugadorSeleccionado?.id === j.id
                      ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white'
                      : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
                  }`}>
                  <p className="font-bold text-sm">{j.nombre} {j.apellidos}</p>
                  <p className={`text-xs mt-1 ${jugadorSeleccionado?.id === j.id ? 'text-[#D0E4F7]' : 'text-gray-400'}`}>
                    {j.comunidad} · {j.anio_nacimiento}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selector torneo */}
        {jugadorSeleccionado && (
          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-2 block">Torneo</label>
            <div className="flex flex-col gap-2">
              {torneos.map(t => (
                <button key={t.id} onClick={() => setTorneoSeleccionado(t)}
                  className={`p-4 rounded-2xl border-2 text-left ${
                    torneoSeleccionado?.id === t.id
                      ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white'
                      : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
                  }`}>
                  <p className="font-bold text-sm">{t.nombre}</p>
                  <p className={`text-xs mt-1 ${torneoSeleccionado?.id === t.id ? 'text-[#D0E4F7]' : 'text-gray-400'}`}>
                    📍 {t.ciudad} · {new Date(t.fecha_inicio).toLocaleDateString('es-ES')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selector categoría */}
        {torneoSeleccionado && (
          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-2 block">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIAS.map(c => (
                <button key={c} onClick={() => setCategoria(c)}
                  className={`py-2 rounded-xl border-2 text-sm font-semibold ${
                    categoria === c
                      ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white'
                      : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
                  }`}>
                  {ETIQUETAS[c] || c}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm ${
            mensaje.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-[#E8F5E2] text-[#2D6A4F]'
          }`}>
            {mensaje}
          </div>
        )}

        {jugadorSeleccionado && torneoSeleccionado && categoria && (
          <button onClick={handleApuntarse} disabled={cargando}
            className="w-full bg-[#5CB840] text-white font-bold py-4 rounded-full text-base disabled:opacity-50">
            {cargando ? 'Apuntando...' : '🎾 Apuntarme y buscar pareja'}
          </button>
        )}
      </div>
    </main>
  )
}