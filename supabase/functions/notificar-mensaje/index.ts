import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload = await req.json()
  const mensaje = payload.record

  // Obtener email del destinatario
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const userRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${mensaje.para_user_id}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  })
  const userData = await userRes.json()
  const emailDestinatario = userData.email

  if (!emailDestinatario) {
    return new Response('No email found', { status: 400 })
  }

  // Enviar email con Resend
  const resendKey = Deno.env.get('RESEND_API_KEY')!

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Compiñero <notificaciones@compinero.es>',
      to: emailDestinatario,
      subject: '💬 Tienes un nuevo mensaje en Compiñero',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #1A5FAF;">Tienes un nuevo mensaje</h2>
          <p>Alguien te ha escrito en <strong>Compiñero</strong>.</p>
          <a href="https://compinero.es/chat" 
             style="background: #1A5FAF; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold;">
            Ver mensaje
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Compiñero · Plataforma de pádel juvenil</p>
        </div>
      `
    })
  })

  return new Response('OK', { status: 200 })
})