'use client'

import { useState } from 'react'
import { supabase } from '../supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function handleUpdate() {
    if (password !== confirmar) {
      setMensaje('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setCargando(true)
    setMensaje('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMensaje('Error al actualizar. El enlace puede haber caducado.')
    } else {
      setExito(true)
      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-[#F4F8FF] flex flex-col">

      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center gap-4">
        <h1 className="text-white font-bold text-lg">Nueva contraseña</h1>
      </header>

      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full flex flex-col justify-center">

        {exito ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-[#1A5FAF] font-bold text-2xl mb-2">¡Contraseña actualizada!</h2>
            <p className="text-gray-500 text-sm">Redirigiendo al login en unos segundos...</p>
          </div>
        ) : (
          <>
            <h2 className="text-[#1A5FAF] font-bold text-2xl mb-2">Crea una nueva contraseña</h2>
            <p className="text-gray-500 text-sm mb-8">Elige una contraseña segura de al menos 6 caracteres.</p>

            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-[#D0E4F7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A5FAF]"
                />
              </div>
              <div>
                <label className="text-[#1A5FAF] font-bold text-sm mb-1 block">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  placeholder="Repite la contraseña"
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
              onClick={handleUpdate}
              disabled={cargando}
              className="w-full bg-[#1A5FAF] text-white font-bold py-4 rounded-full text-base disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}