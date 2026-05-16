export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F8FF]">

      {/* HEADER */}
      <header className="bg-[#1A5FAF] px-6 py-4 flex items-center justify-between">
        <div>
          <img src="/logo.png" alt="Compiñero" className="h-20 w-auto" />
          
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-[#1A5FAF] text-sm font-semibold px-4 py-2 rounded-full">
            Entrar
          </button>
          <button className="bg-[#5CB840] text-white text-sm font-semibold px-4 py-2 rounded-full">
            Registro
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#1A5FAF] px-6 pb-10 pt-6 text-center">
        <div className="inline-block bg-[#5CB840] text-white text-xs font-bold px-4 py-1 rounded-full mb-4">
          Discreta · Privada · Sin spam · Segura
        </div>
        <h2 className="text-white text-3xl font-bold leading-tight mb-3">
          Encuentra la pareja<br />perfecta de torneo
        </h2>
        <p className="text-[#D0E4F7] text-sm mb-6">
          La plataforma de emparejamiento para torneos de pádel juvenil. Solo ven tu perfil quienes también buscan pareja.
        </p>
        <button className="bg-[#5CB840] text-white font-bold px-8 py-3 rounded-full text-base w-full max-w-xs">
          Empezar gratis
        </button>
      </section>

      {/* 3 BENEFICIOS */}
      <section className="px-4 py-8 grid grid-cols-1 gap-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D0E4F7]">
          <div className="w-10 h-10 bg-[#1A5FAF] rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h3 className="text-[#1A5FAF] font-bold text-base mb-1">Discreción total</h3>
          <p className="text-gray-500 text-sm">Solo ven tu perfil quienes también buscan pareja. Sin estigmas ni chismes.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D0E4F7]">
          <div className="w-10 h-10 bg-[#5CB840] rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold text-lg">!</span>
          </div>
          <h3 className="text-[#1A5FAF] font-bold text-base mb-1">Sin notificaciones inútiles</h3>
          <p className="text-gray-500 text-sm">Solo torneos de tu categoría, zona y fechas disponibles. Adiós al spam de grupos de WhatsApp.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#D0E4F7]">
          <div className="w-10 h-10 bg-[#1A5FAF] rounded-full flex items-center justify-center mb-3">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h3 className="text-[#1A5FAF] font-bold text-base mb-1">Chat privado</h3>
          <p className="text-gray-500 text-sm">Contacta sin compartir tu teléfono. Tú decides cuándo y si dar tus datos de contacto.</p>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-white px-6 py-8 max-w-md mx-auto">
        <h2 className="text-[#1A5FAF] font-bold text-xl mb-6 text-center">¿Cómo funciona?</h2>
        <div className="flex flex-col gap-5">
          {[
            { n: "1", t: "Regístrate", d: "Crea tu cuenta como progenitor o técnico." },
            { n: "2", t: "Crea el perfil del jugador/a", d: "Añade licencia FEP, año de nacimiento, lado preferido y fotos (y si quieres vídeos). Al final tendrás un hueco para comentarios." },
            { n: "3", t: "Elige torneo y categoría", d: "Selecciona el torneo y la categoría en la que gustaría participar." },
            { n: "4", t: "Descubre jugadores", d: "Ve perfiles de quienes buscan pareja para ese mismo torneo." },
            { n: "5", t: "¡Match y chat!", d: "Cuando hay interés mutuo, se abre un chat privado seguro." },
          ].map((s) => (
            <div key={s.n} className="flex gap-4 items-start">
              <div className="w-9 h-9 bg-[#1A5FAF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{s.n}</span>
              </div>
              <div>
                <p className="text-[#1A5FAF] font-bold text-sm">{s.t}</p>
                <p className="text-gray-500 text-sm">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#1A5FAF] px-6 py-10 text-center">
        <h2 className="text-white font-bold text-xl mb-2">¿Listo para encontrar pareja?</h2>
        <p className="text-[#D0E4F7] text-sm mb-6">Gratis para empezar. Sin tarjeta de crédito.</p>
        <button className="bg-[#5CB840] text-white font-bold px-8 py-3 rounded-full text-base w-full max-w-xs">
          Crear cuenta gratis
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D2E5A] px-6 py-5 text-center">
        <p className="text-[#D0E4F7] text-xs">© 2025 Compiñero · Plataforma de pádel juvenil</p>
        <p className="text-[#D0E4F7] text-xs mt-1">compiñero.es · Protección de datos RGPD</p>
      </footer>

    </main>
  );
}