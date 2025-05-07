const { getConnection } = require('../config/db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Enviar email de bienvenida
exports.sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Bienvenido a nuestro servicio',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              background-color: #ffffff;
            }
            h1 {
              color: #0074d9;
              font-size: 28px;
            }
            p {
              font-size: 16px;
              color: #333333;
            }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background: #fffffff;
            border: 2px solid #0074d9;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }

          .footer {
            font-size: 12px;
            color: #999999;
            text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>¡Bienvenido, ${username}!</h1>
            <p>Gracias por registrarte en el Aura Event Center. Estamos emocionados de tenerte con nosotros. A continuación, puedes comenzar a disfrutar de todas las funciones que ofrecemos.</p>
            <p>Si tienes alguna duda o pregunta, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
            <a href=http://localhost:5173 class="button">Comienza ahora</a>
            <hr style="border: 0; border-top: 1px solid #0074d9; margin: 20px 0;">
            <div class="footer">
              <p>&copy; 2025 Centro de Eventos Aura. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de bienvenida enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo de bienvenida:', error);
  }
};

// Enviar código de recuperación
exports.sendRecoveryCode = async (req, res) => {
  const { email } = req.body;

  // Generar código y firmarlo con JWT
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const token = jwt.sign({ email, code }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            background-color: #ffffff;
          }
          h1 {
            color: #0074d9;
            font-size: 28px;
          }
          p {
            font-size: 16px;
            color: #333333;
          }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background: #fffffff;
          border: 2px solid #0074d9;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        }

          .footer {
            font-size: 12px;
            color: #999999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>Recupera tu contraseña</h1>
          <p>Hemos recibido una solicitud para recuperar tu contraseña. Usa el siguiente código para continuar con el proceso:</p>
          <h2 style="color: #0074d9; text-align: center; font-size: 28px;">${code}</h2>
          <p>Este código es válido por 10 minutos. Si no solicitaste este cambio, por favor ignora este correo.</p>
          <a href=http://localhost:5173/verificar-codigo class="button">Recuperar contraseña</a>
          <hr style="border: 0; border-top: 1px solid #0074d9; margin: 20px 0;">
          <div class="footer">
            <p>&copy; 2025 Centro de Eventos Aura. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Código enviado', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};

// Verificar código ingresado por el usuario
exports.verifyCode = async (req, res) => {
  const { code, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.code === code) {
      res.status(200).json({ message: 'Código válido', email: decoded.email });
    } else {
      res.status(400).json({ message: 'Código incorrecto' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

// Cambiar la contraseña del usuario
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    let conn;
    try {
      conn = await getConnection();
  
      const result = await conn.execute(
        `UPDATE CLIENT_SCHEMA.USERS SET PASSWORD = :newPassword WHERE EMAIL = :email`,
        { newPassword, email },
        { autoCommit: true }
      );
  
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('❌ Error al actualizar la contraseña:', error);
      res.status(500).json({ error: 'Error del servidor' });
    } finally {
      if (conn) await conn.close();
    }
  };
