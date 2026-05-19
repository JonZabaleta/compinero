'use client'

import { useState } from 'react'
import { supabase } from '../supabase'

const COMUNIDADES = [
  'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
  'Cantabria', 'Castilla-La Mancha', 'Castilla y León', 'Cataluña',
  'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia',
  'Navarra', 'País Vasco', 'Valencia', 'Ceuta', 'Melilla'
]

const LADOS = [
  'Solo revés', 'Solo drive', 'Solo drive (zurdo)',
  'Prefiero drive', 'Prefiero revés', 'Indistinto'
]

export default function PerfilJugador() {
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [licencia, setLicencia] = useState('')
  const [anio, setAnio] = useState('')
  const [sexo, setSexo] = useState('')
  const [comunidad, setComunidad] = useState('')
  const [lado, setLado] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
const [fotoUrl, setFotoUrl] = useState('')
const [subiendoFoto, setSubiendoFoto] = useState(false)
const [nivelTecnico, setNivelTecnico] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleGuardar() {
    let urlFoto = ''
if (foto) {
  setSubiendoFoto(true)
  const { data: { user } } = await supabase.auth.getUser()
  const nombreArchivo = `${user?.id}_${Date.now()}.${foto.name.split('.').pop()}`
  const { error: errorFoto } = await supabase.storage
    .from('fotos-jugadores')
    .upload(nombreArchivo, foto)
  if (!errorFoto) {
    const { data } = supabase.storage.from('fotos-jugadores').getPublicUrl(nombreArchivo)
    urlFoto = data.publicUrl
  }
  setSubiendoFoto(false)
}setCargando(true)
    setMensaje('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/login'
      return
    }

    const { error } = await supabase.from('jugadores').insert({
      nombre,
      apellidos,
      licencia_fep: licencia,
      anio_nacimiento: parseInt(anio),
      sexo,
      comunidad,
      lado_preferido: lado,
      descripcion,
      nivel_tecnico: nivelTecnico || null,
      foto_url: urlFoto || null,
      user_id: user.id,
    })

    if (error) {
      setMensaje('Error al guardar: ' + error.message)
    } else {
      setMensaje('¡Perfil guardado correctamente!')
      setTimeout(() => window.location.href = '/dashboard', 2000)
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">

      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <a href="/dashboard" className="text-white text-sm">← Volver</a>
        <h1 className="text-white font-bold text-lg">Perfil del jugador</h1>
      </header>

      <div className="px-6 py-8 max-w-md mx-auto w-full">

        <p className="text-gray-500 text-sm mb-6">Rellena los datos del jugador/a para que otros puedan encontrarle.</p>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Nombre *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Nombre del jugador/a"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]" />
          </div>

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Apellidos *</label>
            <input type="text" value={apellidos} onChange={e => setApellidos(e.target.value)}
              placeholder="Apellidos del jugador/a"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]" />
          </div>

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Licencia FEP *</label>
            <input type="text" value={licencia} onChange={e => setLicencia(e.target.value)}
              placeholder="Número de licencia FEP"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]" />
          </div>

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Año de nacimiento *</label>
            <input type="number" value={anio} onChange={e => setAnio(e.target.value)}
              placeholder="Ej: 2012"
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]" />
          </div>

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Sexo *</label>
            <div className="grid grid-cols-2 gap-3">
              {['Niño', 'Niña'].map(s => (
                <button key={s} onClick={() => setSexo(s)}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold ${
                    sexo === s ? 'border-[#1A5FAF] bg-[#1A5FAF] text-white' : 'border-[#D0E4F7] bg-white text-[#1A5FAF]'
                  }`}>
                  {s === 'Niño' ? '👦 Niño' : '👧 Niña'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Comunidad autónoma *</label>
            <select value={comunidad} onChange={e => setComunidad(e.target.value)}
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF] bg-white">
              <option value="">Selecciona comunidad</option>
              {COMUNIDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Lado preferido *</label>
            <select value={lado} onChange={e => setLado(e.target.value)}
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF] bg-white">
              <option value="">Selecciona lado</option>
              {LADOS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
<div>
  <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Foto del jugador/a</label>
  {fotoUrl && (
    <img src={fotoUrl} alt="Foto" className="w-24 h-24 rounded-full object-cover mb-2" />
  )}
  <input
    type="file"
    accept="image/*"
    onChange={e => {
      const file = e.target.files?.[0]
      if (file) {
        setFoto(file)
        setFotoUrl(URL.createObjectURL(file))
      }
    }}
    className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm"
  />
</div>
          <div>
            <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)}
              placeholder="Cuéntanos algo sobre el jugador/a, su nivel, experiencia..."
              rows={4}
              className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]" />
          <div>
  <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Nivel técnico <span className="text-gray-400 font-normal">(opcional, asignado por el entrenador)</span></label>
  <select value={nivelTecnico} onChange={e => setNivelTecnico(e.target.value)}
    className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF] bg-white">
    <option value="">Sin nivel asignado</option>
    <option value="1">1 - Iniciación</option>
    <option value="2">2 - Básico</option>
    <option value="3">3 - Intermedio</option>
    <option value="4">4 - Avanzado</option>
    <option value="5">5 - Competición</option>
  </select>
</div></div>

        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl text-sm my-4 ${
            mensaje.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-[#E8F5E2] text-[#2D6A4F]'
          }`}>
            {mensaje}
          </div>
        )}

        <button onClick={handleGuardar} disabled={cargando}
          className="w-full bg-[#5CB840] text-white font-bold py-4 rounded-full text-base mt-6 disabled:opacity-50">
          {cargando ? 'Guardando...' : 'Guardar perfil'}
        </button>

      </div>
    </main>
  )
}