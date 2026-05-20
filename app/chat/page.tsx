'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Chat() {
  const [conversaciones, setConversaciones] = useState<any[]>([])
  const [usuarioActual, setUsuarioActual] = useState<any>(null)
  const [chatActivo, setChatActivo] = useState<any>(null)
  const [mensajes, setMensajes] = useState<any[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUsuarioActual(user)// Si venimos desde buscar, abrir chat directamente
const params = new URLSearchParams(window.location.search)
const paraUserId = params.get('para')
const jugadorParaId = params.get('jugador')
if (paraUserId && jugadorParaId) {
  const { data: jug } = await supabase
    .from('jugadores')
    .select('nombre,apellidos')
    .eq('id', jugadorParaId)
    .single()
  setChatActivo({ userId: paraUserId, jugadorId: jugadorParaId, jugador: jug })
}

      const { data } = await supabase
        .from('mensajes')
        .select('*')
        .or(`de_user_id.eq.${user.id},para_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (data) {
        const convMap = new Map()
        data.forEach((m: any) => {
          const otroId = m.de_user_id === user.id ? m.para_user_id : m.de_user_id
          const otroJugadorId = m.de_user_id === user.id ? m.jugador_para_id : m.jugador_de_id
          if (!convMap.has(otroId)) {
            convMap.set(otroId, { userId: otroId, jugadorId: otroJugadorId, ultimoMensaje: m })
          }
        })
        const convArr = Array.from(convMap.values())
        
        for (let conv of convArr) {
          const { data: jug } = await supabase.from('jugadores').select('nombre,apellidos').eq('id', conv.jugadorId).single()
          conv.jugador = jug
        }
        setConversaciones(convArr)
      }
    }
    cargar()
  }, [])

  async function abrirChat(conv: any) {
    setChatActivo(conv)
    const { data } = await supabase
      .from('mensajes')
      .select('*')
      .or(`and(de_user_id.eq.${usuarioActual.id},para_user_id.eq.${conv.userId}),and(de_user_id.eq.${conv.userId},para_user_id.eq.${usuarioActual.id})`)
      .order('created_at', { ascending: true })
    if (data) setMensajes(data)
  }

  async function handleEnviar() {
    if (!nuevoMensaje.trim() || !chatActivo) return
    setEnviando(true)

    const { data: miJugador } = await supabase
      .from('jugadores')
      .select('id')
      .eq('user_id', usuarioActual.id)
      .single()

    await supabase.from('mensajes').insert({
      de_user_id: usuarioActual.id,
      para_user_id: chatActivo.userId,
      jugador_de_id: miJugador?.id,
      jugador_para_id: chatActivo.jugadorId,
      contenido: nuevoMensaje.trim()
    })

    setNuevoMensaje('')
    await abrirChat(chatActivo)
    setEnviando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        {chatActivo ? (
          <button onClick={() => setChatActivo(null)} className="text-white text-sm">← Volver</button>
        ) : (
          <a href="/dashboard" className="text-white text-sm">← Volver</a>
        )}
        <h1 className="text-white font-bold text-lg">
          {chatActivo ? (chatActivo.jugador?.nombre + ' ' + chatActivo.jugador?.apellidos) : 'Mensajes'}
        </h1>
      </header>

      {!chatActivo ? (
        <div className="px-6 py-8 max-w-md mx-auto w-full">
          {conversaciones.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-5xl mb-4">💬</p>
              <p className="text-[#1A5FAF] font-bold text-lg mb-2">No tienes mensajes</p>
              <p className="text-gray-400 text-sm">Cuando contactes con alguien aparecerá aquí.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {conversaciones.map((conv, i) => (
                <button key={i} onClick={() => abrirChat(conv)}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#D0E4F7] text-left flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1A5FAF] rounded-full flex items-center justify-center text-white font-bold">
                    {conv.jugador?.nombre?.[0]}{conv.jugador?.apellidos?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1A5FAF] font-bold text-sm">{conv.jugador?.nombre} {conv.jugador?.apellidos}</p>
                    <p className="text-gray-400 text-xs truncate">{conv.ultimoMensaje?.contenido}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          <div className="flex-1 px-4 py-4 flex flex-col gap-3 overflow-y-auto">
            {mensajes.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">Inicia la conversación</p>
            )}
            {mensajes.map((m: any) => (
              <div key={m.id} className={`flex ${m.de_user_id === usuarioActual?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  m.de_user_id === usuarioActual?.id
                    ? 'bg-[#1A5FAF] text-white rounded-br-sm'
                    : 'bg-white text-[#1A5FAF] border border-[#D0E4F7] rounded-bl-sm'
                }`}>
                  {m.contenido}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#D0E4F7] flex gap-2">
            <input
              type="text"
              value={nuevoMensaje}
              onChange={e => setNuevoMensaje(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEnviar()}
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-[#D0E4F7] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1A5FAF]"
            />
            <button onClick={handleEnviar} disabled={enviando}
              className="bg-[#1A5FAF] text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50">
              ➤
            </button>
          </div>
        </div>
      )}
    </main>
  )
}