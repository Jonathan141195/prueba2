const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// Configura el transporte de correo con SMTP2GO
const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 587, // O 465 para SSL
  secure: false, // Si usas TLS, ponlo en true
  auth: {
    user: 'taller_alvarez.com', // Reemplaza con tu usuario SMTP2GO
    pass: '2y1ww5oRYXFhtgcm', // Reemplaza con tu contraseña SMTP2GO
  },
});

app.post('/send-pdf', upload.single('file'), async (req, res) => {
  const { email } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const mailOptions = {
      from: 'no-reply@yourdomain.com', // Puedes usar una dirección genérica o verificada en SMTP2GO
      to: email,
      subject: 'Factura PDF',
      text: 'Adjunto encontrarás la factura en PDF.',
      attachments: [
        {
          filename: 'factura.pdf',
          content: file.buffer,
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('PDF enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el PDF:', error);
    res.status(500).send('Error al enviar el PDF');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});


