const express = require("express");
const cors = require("cors");
const sendEmailHandler = require("./send-email.js");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Permitir todos los subdominios de vercel.app y el dominio principal
    if (
      origin.endsWith(".vercel.app") ||
      origin === "https://vera-ortiz.vercel.app"
    ) {
      return callback(null, true);
    }
    // No lanzar error, solo rechazar el origen
    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'API funcionando',
    endpoints: {
      contact: '/api/send-email (POST)'
    }
  });
});

app.post("/api/send-email", sendEmailHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});