'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const CATEGORIAS = ['Benjamin', 'Alevin', 'Infantil', 'Cadete', 'Junior']
const ETIQUETAS: {[key:string]:string} = {
  'Benjamin':'Benjamín', 'Alevin':'Alevín', 'Junior':'Júnior'
}

export default function Buscar() {
  const [torneos, setTorneos] = useState<any[]>([])
  const [torneoSeleccionado, setTorneoSeleccionado] = useState<any>(null)
  const [categoria, setCategoria] = useState('')
  const [jugadores, setJugadores] = useState<any[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscado, setBuscado] = useState(false)

 useEffect(() => {
  supabase.from('torneos').select('*').eq('activo', true).then(({ data }) => {
    if (data) {
      setTorneos(data)
      const params = new URLSearchParams(window.location.search)
      const torneoId = params.get('torneo')
      const cat = params.get('categoria')
      if (torneoId && cat && data) {
        const torneo = data.find((t: any) => t.id === parseInt(torneoId))
        if (torneo) {
          setTorneoSeleccionado(torneo)
          setCategoria(cat)
        }
      }
    }
  })
}, [])
useEffect(() => {
  if (torneoSeleccionado && categoria) {
    handleBuscar()
  }
}, [torneoSeleccionado, categoria])

  async function handleBuscar() {
  if (!torneoSeleccionado || !categoria) return
  setBuscando(true)
  setBuscado(false)

  const { data: inscData } = await supabase
    .from('inscripciones')
    .select('*')
    .eq('torneo_id', torneoSeleccionado.id)
    .eq('categoria', categoria)
    .eq('busca_pareja', true)

  console.log('inscData:', inscData)
  if (!inscData || inscData.length === 0) {
    setJugadores([])
    setBuscando(false)
    setBuscado(true)
    return
  }

  const jugadorIds = inscData.map((i: any) => i.jugador_id)

  const { data: jugData } = await supabase
    .from('jugadores')
    .select('*')
    .in('id', jugadorIds)

  const resultado = inscData.map((ins: any) => ({
    ...ins,
    jugadores: jugData?.find((j: any) => j.id === ins.jugador_id) || null
  }))

  setJugadores(resultado)
  setBuscando(false)
  setBuscado(true)
}

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <a href="/dashboard" className="text-white text-sm">← Volver</a>
        <h1 className="text-white font-bold text-lg">Buscar pareja</h1>
      </header>

      <div className="px-6 py-8 max-w-md mx-auto w-full">
        <p className="text-gray-500 text-sm mb-6">Elige el torneo y categoría para ver quién busca pareja.</p>

        <div className="mb-4">
          <label className="text-[#1A5FAF] font-bold text-sm mb-2 block">Torneo</label>
          <div className="flex flex-col gap-2">
            {torneos.map(t => (
              <button key={t.id} onClick={() => setTorneoSeleccionado(t)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  torneoSeleccionado?.id === t.id
                    ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white'
                    : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
                }`}>
                <p className="font-bold text-sm">{t.nombre}</p>
                <p className={`text-xs mt-1 ${torneoSeleccionado?.id === t.id ? 'text-[#D0E4F7]' : 'text-gray-400'}`}>
                  📍 {t.ciudad} · {new Date(t.fecha_inicio).toLocaleDateString('es-ES')} - {new Date(t.fecha_fin).toLocaleDateString('es-ES')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {torneoSeleccionado && (
          <div className="mb-6">
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

        {torneoSeleccionado && categoria && (
          <button onClick={handleBuscar} disabled={buscando}
            className="w-full bg-[#5CB840] text-white font-bold py-4 rounded-full text-base mb-6 disabled:opacity-50">
            {buscando ? 'Buscando...' : 'Ver jugadores disponibles'}
          </button>
        )}

        {buscado && jugadores.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-4">😔</p>
            <p className="text-[#1A5FAF] font-bold text-lg mb-2">No hay jugadores todavía</p>
            <p className="text-gray-400 text-sm">Sé el primero en apuntarte a este torneo y categoría.</p>
          </div>
        )}

        {buscado && jugadores.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-[#1A5FAF] font-bold text-sm">{jugadores.length} jugador{jugadores.length > 1 ? 'es' : ''} buscando pareja</p>
            {jugadores.map((ins: any) => (
              <div key={ins.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#D0E4F7]">
                <div className="flex items-center gap-3 mb-3">
                  {ins.jugadores?.foto_url ? (
  <img src={ins.jugadores.foto_url} alt="Foto" className="w-12 h-12 rounded-full object-cover" />
) : (
  <div className="w-12 h-12 bg-[#1A5FAF] rounded-full flex items-center justify-center text-white font-bold text-lg">
    {ins.jugadores?.nombre?.[0]}{ins.jugadores?.apellidos?.[0]}
  </div>
)}
                  <div>
                    <p className="text-[#1A5FAF] font-bold">{ins.jugadores?.nombre} {ins.jugadores?.apellidos}</p>
                    <p className="text-gray-400 text-xs">{ins.jugadores?.comunidad} · {ins.jugadores?.anio_nacimiento}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="bg-[#E8F5E2] text-[#2D6A4F] text-xs font-bold px-3 py-1 rounded-full">
                    {ins.jugadores?.lado_preferido}
                  </span>
                  {ins.jugadores?.nivel_tecnico && (
                    <span className="bg-[#EBF4FF] text-[#1A5FAF] text-xs font-bold px-3 py-1 rounded-full">
                      Nivel {ins.jugadores?.nivel_tecnico}
                    </span>
                  )}
                </div>
                {ins.jugadores?.descripcion && (
                  <p className="text-gray-500 text-sm">{ins.jugadores?.descripcion}</p>
                )}
                <a href={`/chat`} className="w-full mt-3 bg-[#1A5FAF] text-white font-bold py-2 rounded-full text-sm flex items-center justify-center">
  💬 Contactar
</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}