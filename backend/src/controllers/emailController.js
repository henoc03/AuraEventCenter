/**
 * @abstract Controlador encargado de gestionar la lógica de envío de correos electrónicos relacionados
 * con la autenticación y bienvenida de usuarios en el sistema Aura Event Center.
 * Incluye funcionalidades para enviar correos de bienvenida, códigos de recuperación de contraseña,
 * verificar códigos mediante JWT y actualizar la contraseña del usuario en la base de datos.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

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

/**
 * Envía un correo electrónico de bienvenida al nuevo usuario.
 * @param {string} email - Dirección de correo del destinatario.
 * @param {string} username - Nombre de usuario para personalizar el mensaje.
 */
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
              padding: 20px;
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
              background: #0074d9;
              border: none;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer {
              font-size: 12px;
              color: #999999;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>¡Bienvenido, ${username}!</h1>
            <p>Gracias por registrarte en el Aura Event Center. Estamos emocionados de tenerte con nosotros. A continuación, puedes comenzar a disfrutar de todas las funciones que ofrecemos.</p>
            <p>Si tienes alguna duda o pregunta, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
            <a href="http://localhost:5173"
              style="display:inline-block; padding:10px 20px; background:#0074d9; border:none; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold;">
              Comienza ahora
            </a>
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

/**
 * Envía un código de recuperación por correo electrónico para restablecer contraseña.
 * Genera un código numérico de 6 dígitos, lo firma con JWT y lo envía al email indicado.
 * @param {Request} req - Objeto request de Express, espera { email } en body.
 * @param {Response} res - Objeto response de Express.
 */
exports.sendRecoveryCode = async (req, res) => {
  const { email } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
    `SELECT * FROM CLIENT_SCHEMA.USERS WHERE EMAIL = :email`,
    { email }
  );

  if (result.rows.length === 0) {
    // No existe el correo, no enviamos correo, pero devolvemos éxito igual
    return res.status(200).json({ message: 'Si el correo está registrado, se ha enviado un código de recuperación.' });
  }

  // Generar código aleatorio de 6 dígitos como string
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Firmar el código junto con el email en un token JWT válido por 10 minutos
  const token = jwt.sign({ email, code }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const mailOptions = {
    from: process.env.MAIL_USER,
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
              padding: 20px;
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
              background: #0074d9;
              border: none;
              color: #ffffff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            .footer {
              font-size: 12px;
              color: #999999;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>Recupera tu contraseña</h1>
            <p>Hemos recibido una solicitud para recuperar tu contraseña. Usa el siguiente código para continuar con el proceso:</p>
            <h2 style="color: #0074d9; text-align: center; font-size: 28px;">${code}</h2>
            <p>Este código es válido por 10 minutos. Si no solicitaste este cambio, por favor ignora este correo.</p>
            <a href="http://localhost:5173/verificar-codigo" class="button">Recuperar contraseña</a>
            <hr style="border: 0; border-top: 1px solid #0074d9; margin: 20px 0;">
            <div class="footer">
              <p>&copy; 2025 Centro de Eventos Aura. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Si el correo está registrado, se ha enviado un código de recuperación.', token });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }finally {
    if (conn) await conn.close();
  }
};

/**
 * Verifica que el código ingresado por el usuario coincida con el token JWT enviado.
 * @param {Request} req - Objeto request de Express, espera { code, token } en body.
 * @param {Response} res - Objeto response de Express.
 */
exports.verifyCode = async (req, res) => {
  const { code, token } = req.body;

  try {
    // Decodifica y verifica el token JWT usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Compara el código del token con el código enviado por el usuario
    if (decoded.code === code) {
      res.status(200).json({ message: 'Código válido', email: decoded.email });
    } else {
      res.status(400).json({ message: 'Código incorrecto' });
    }
  } catch (err) {
    // Si el token es inválido o expiró, responde con error
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

/**
 * Actualiza la contraseña del usuario en la base de datos.
 * @param {Request} req - Objeto request de Express, espera { email, newPassword } en body.
 * @param {Response} res - Objeto response de Express.
 */
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  let conn;
  try {
    conn = await getConnection();

    // Ejecuta actualización con autoCommit para guardar cambios
    const result = await conn.execute(
      `UPDATE CLIENT_SCHEMA.USERS SET PASSWORD = :newPassword WHERE EMAIL = :email`,
      { newPassword, email },
      { autoCommit: true }
    );

    // Si no se afectaron filas, el usuario no existe
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

exports.contact = async (req, res) => {
const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: `Consulta desde Sitio Web - ${subject}`,
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong><br>${message}</p>
      `
    });

    res.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo.' });
  }
};

exports.sendBookingConfirmation = async (req, res) => {
  const { email, name, paymentSummary } = req.body;
  if (!email || !paymentSummary) {
    console.log("[CONFIRM EMAIL] Faltan datos:", { email, paymentSummary });
    return res.status(400).json({ message: "Faltan datos para enviar el correo." });
  }

  // Construir el desglose en HTML
  let zonasHtml = paymentSummary.zonas.map(zona => `
    <div style="margin-bottom:16px;">
      <h3 style="margin:0 0 4px 0;">${zona.name}</h3>
      <ul>
        <li><b>Precio base:</b> ₡${zona.basePrice.toLocaleString()} (${zona.hours} hora${zona.hours !== 1 ? "s" : ""})</li>
        ${zona.menus.map(m => `<li>Menú: ${m.NAME} - ₡${m.PRICE.toLocaleString()}</li>`).join("")}
        ${zona.services.map(s => `<li>Servicio: ${s.NAME} - ₡${s.PRICE.toLocaleString()}</li>`).join("")}
        ${zona.equipments.map(e => `<li>Equipo: ${e.NAME} - ₡${e.UNITARY_PRICE.toLocaleString()}</li>`).join("")}
      </ul>
      <b>Subtotal zona:</b> ₡${zona.subtotal.toLocaleString()}
    </div>
  `).join("");

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>¡Gracias por tu reserva${name ? ', ' + name : ''}!</h2>
        <p>Te confirmamos que tu pago fue exitoso. Aquí tienes el desglose de tu reserva:</p>
        ${zonasHtml}
        <hr>
        <p><b>Subtotal:</b> ₡${paymentSummary.total.toLocaleString()}</p>
        <p><b>IVA (13%):</b> ₡${paymentSummary.iva.toLocaleString()}</p>
        <p><b>Total pagado:</b> ₡${paymentSummary.totalConIva.toLocaleString()}</p>
        <p>¡Te esperamos en Aura Event Center!</p>
      </body>
    </html>
  `;

  try {
    console.log("[CONFIRM EMAIL] Enviando correo a:", email);
    console.log("[CONFIRM EMAIL] Nombre:", name);
    console.log("[CONFIRM EMAIL] Resumen zonas:", JSON.stringify(paymentSummary.zonas, null, 2));
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Confirmación de reserva - Aura Event Center",
      html
    });
    console.log("[CONFIRM EMAIL] Correo enviado correctamente a:", email);
    res.json({ success: true });
  } catch (error) {
    console.error("[CONFIRM EMAIL] Error al enviar correo de confirmación:", error);
    res.status(500).json({ message: "Error al enviar el correo de confirmación" });
  }
};
