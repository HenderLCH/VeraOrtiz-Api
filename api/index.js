const express = require("express");
const cors = require("cors");
const sendEmailHandler = require("./send-email.js");

const app = express();
const allowedOrigins = ["https://vera-ortiz.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como curl o Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
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