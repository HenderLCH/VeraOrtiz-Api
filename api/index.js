export default function handler(req, res) {
  // Solo responde a GET para verificar el estado
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'API funcionando',
      endpoints: {
        contact: '/api/send-email (POST)'
      }
    });
  }

  // Para otros métodos (POST, etc.)
  return res.status(404).json({ 
    error: 'Not found',
    message: 'Use el endpoint específico /api/send-email para enviar mensajes'
  });
}