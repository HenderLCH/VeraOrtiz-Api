import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // OPTIONS preflight: devolver 200 OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo POST para envío de formulario
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  // Import dinámico de Resend para que OPTIONS no falle en importación
  let ResendLib;
  let resend;
  try {
    ResendLib = await import('resend');
    const { Resend } = ResendLib;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return res.status(500).json({ success: false, message: 'Falta RESEND_API_KEY' });
    }
    resend = new Resend(RESEND_API_KEY);
  } catch (err) {
    console.error('Error cargando Resend:', err);
    return res.status(500).json({ success: false, message: 'Error inicializando Resend' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    // Validar campos requeridos
    const requiredFields = ['name', 'email', 'phone', 'message'];
    const missing = requiredFields.filter(f => !data[f]);
    if (missing.length > 0) {
      return res.status(400).json({ success: false, message: `Faltan campos requeridos: ${missing.join(', ')}` });
    }
    // Validaciones específicas
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return res.status(400).json({ success: false, message: 'Formato de email inválido' });
    }
    if (!/^[\d\s+\-()]{10,20}$/.test(data.phone)) {
      return res.status(400).json({ success: false, message: 'Formato de teléfono inválido (10-20 dígitos)' });
    }

    // Enviar correo
    const { error } = await resend.emails.send({
      from: 'Vera Ortiz Web <onboarding@resend.dev>',
      to: ['henderljunior@gmail.com'],
      subject: `Nuevo mensaje de ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1a365d;">¡Nuevo mensaje de contacto!</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Teléfono:</strong> ${data.phone}</p>
          <p><strong>Mensaje:</strong> ${data.message}</p>
        </div>
      `
    });
    if (error) {
      return res.status(500).json({ success: false, message: `Error al enviar email: ${error.message}` });
    }

    return res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (err: any) {
    console.error('Error en handler POST:', err);
    return res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Error interno del servidor' });
  }
}

