const { Resend } = require("resend");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ success: false, message: "Falta RESEND_API_KEY" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const data = req.body || {};
    const requiredFields = ["name", "email", "phone", "message"];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: `Faltan campos requeridos: ${missingFields.join(", ")}` });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ success: false, message: "Formato de email inválido" });
    }

    // Validar teléfono
    const phoneRegex = /^[\d\s+\-()]{10,20}$/;
    if (!phoneRegex.test(data.phone)) {
      return res.status(400).json({ success: false, message: "Formato de teléfono inválido (10-20 dígitos)" });
    }

    // Enviar email
    const { error } = await resend.emails.send({
      from: "Vera Ortiz Web <onboarding@resend.dev>",
      to: ["henderljunior@gmail.com"],
      subject: `Nuevo mensaje de ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #1a365d;">¡Nuevo mensaje de contacto!</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td><strong>Nombre:</strong></td><td>${data.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
            <tr><td><strong>Teléfono:</strong></td><td>${data.phone}</td></tr>
            <tr><td><strong>Mensaje:</strong></td><td>${data.message}</td></tr>
          </table>
        </div>
      `,
    });

    if (error) {
      return res.status(500).json({ success: false, message: `Error al enviar email: ${error.message}` });
    }

    return res.status(200).json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Error interno del servidor" });
  }
}; 