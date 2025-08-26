const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/reserva', async (req, res) => {
  const { name, email, phone, artist, service, date, description } = req.body;

  // Configura tu transporte SMTP (puedes usar Gmail, Outlook, etc.)
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gonnandreu89@gmail.com', // tu correo
      pass: 'mesn ggki gmpw qqax' // Usa una contraseña de aplicación si usas Gmail
    }
  });

  let mailOptions = {
    from: email,
    to: 'gonnandreu89@gmail.com',
    subject: 'Nueva reserva Diroka',
    text: `
      Nombre: ${name}
      Email: ${email}
      Teléfono: ${phone}
      Artista: ${artist}
      Servicio: ${service}
      Fecha: ${date}
      Descripción: ${description}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo enviar el correo.' });
  }
});

app.listen(3000, () => console.log('Servidor iniciado en puerto 3000'));