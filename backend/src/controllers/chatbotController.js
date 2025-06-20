const { getConnection } = require('../config/db');

const intents = [
  {
    keywords: /(zonas|salones|espacios)/,
    handler: async (connection) => {
      const result = await connection.execute(`
        SELECT NAME, DESCRIPTION, CAPACITY, TYPE, PRICE FROM ADMIN_SCHEMA.ZONES
      `);
      const zonas = result.rows.map(
        ([NAME, DESCRIPTION, CAPACITY, TYPE, PRICE]) =>
          `• ${NAME} - Tipo: ${TYPE}\n  Capacidad: ${CAPACITY} personas\n  Precio: $${PRICE}\n  ${DESCRIPTION}`
      ).join("\n\n");
      return `Estas son nuestras zonas disponibles:\n\n${zonas}\n\n¿Puedo ayudarte con algo más?`;
    }
  },
  {
    keywords: /(servicios|servicio|extras)/,
    handler: async (connection) => {
      const result = await connection.execute(`
        SELECT NAME, DESCRIPTION, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES
      `);
      const servicios = result.rows.map(
        ([NAME, DESCRIPTION, PRICE]) =>
          `• ${NAME} - $${PRICE}\n  ${DESCRIPTION}`
      ).join("\n\n");
      return `Ofrecemos los siguientes servicios adicionales:\n\n${servicios}\n\n¿Deseas más información o ayuda con otra consulta?`;
    }
  },
  {
    keywords: /(electronicos|equipos|audio|luces|pantallas)/,
    handler: async (connection) => {
      const result = await connection.execute(`
        SELECT NAME, DESCRIPTION, UNITARY_PRICE, TYPE FROM ADMIN_SCHEMA.EQUIPMENTS
      `);
      const productos = result.rows.map(
        ([NAME, DESCRIPTION, UNITARY_PRICE, TYPE]) =>
          `• ${NAME} (${TYPE}) - $${UNITARY_PRICE}\n  ${DESCRIPTION}`
      ).join("\n\n");
      return `Estos son algunos de nuestros equipos disponibles:\n\n${productos}\n\n¿Te puedo ayudar con algo más?`;
    }
  },
  {
    keywords: /(hola|buenas|hey|saludos)/,
    handler: async () => {
      return "¡Hola! Soy el asistente virtual de Aura Event Center. \nPuedes preguntarme por nuestras zonas, servicios adicionales o equipos disponibles.\n\n¿En qué puedo ayudarte hoy?";
    }
  }
];

function analizarMensaje(msg) {
  const lower = msg.toLowerCase().trim();

  const precioMatch = lower.match(/cu[aá]nto cuesta (alquilar )?(el|la)?\s*(.*)/);
  if (precioMatch){ let entidad = limpiarTexto(precioMatch[3]); return { intent: 'consultar_precio', entidad };}

const detallesMatch = lower.match(/(qu[eé] incluye|detalles (del|de la)|informaci[oó]n sobre|en qu[eé] consiste) (el|la)?\s*(.*)/);
if (detallesMatch) {
  let entidad = limpiarTexto(detallesMatch[4]);
  return { intent: 'detalles_servicio', entidad };
}


  return null;
}

function limpiarTexto(texto) {
  return texto
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?.,!]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(el|la)?\s*(servicio|zona|salon|espacio|equipo)?\s*(de)?\s*/i, '')
    .trim();
}




exports.chatbotResponse = async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();
  let connection;

  try {
    connection = await getConnection();

    const analisis = analizarMensaje(lowerMsg);

    if (analisis?.intent === 'consultar_precio') {
      const nombre = analisis.entidad;

      const zonaResult = await connection.execute(
        `SELECT NAME, PRICE FROM ADMIN_SCHEMA.ZONES WHERE LOWER(NAME) LIKE :name`,
        [`%${nombre.toLowerCase()}%`]
      );
      if (zonaResult.rows.length > 0) {
        const [NAME, PRICE] = zonaResult.rows[0];
        return res.json({
          response: `Alquilar ${NAME} cuesta $${PRICE}. ¿Te interesa reservarlo o saber su disponibilidad?`
        });
      }

      const servicioResult = await connection.execute(
        `SELECT NAME, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) LIKE :name`,
        [`%${nombre.toLowerCase()}%`]
      );
      if (servicioResult.rows.length > 0) {
        const [NAME, PRICE] = servicioResult.rows[0];
        return res.json({
          response: `El servicio ${NAME} cuesta $${PRICE}. ¿Deseas saber más detalles?`
        });
      }

      const equipoResult = await connection.execute(
        `SELECT NAME, UNITARY_PRICE FROM ADMIN_SCHEMA.EQUIPMENTS WHERE LOWER(NAME) LIKE :name`,
        [`%${nombre.toLowerCase()}%`]
      );
      if (equipoResult.rows.length > 0) {
        const [NAME, UNITARY_PRICE] = equipoResult.rows[0];
        return res.json({
          response: `El servicio ${NAME} cuesta $${UNITARY_PRICE}. ¿Deseas saber más detalles?`
        });
      }

      return res.json({
        response: `No encontré información de precio para "${nombre}". ¿Podrías verificar el nombre o darme más detalles?`
      });
    }

    if (analisis?.intent === 'detalles_servicio') {
      const nombre = analisis.entidad;

      const result = await connection.execute(
        `SELECT NAME, DESCRIPTION FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) LIKE :name`,
        [`%${nombre.toLowerCase()}%`]
      );
      if (result.rows.length > 0) {
        const [NAME, DESCRIPTION] = result.rows[0];
        return res.json({ response: `El servicio ${NAME} incluye:\n\n${DESCRIPTION}` });
      }

      return res.json({
        response: `No encontré detalles sobre "${nombre}". ¿Podrías reformular la consulta o verificar el nombre?`
      });
    }

    for (const intent of intents) {
      if (intent.keywords.test(lowerMsg)) {
        const response = await intent.handler(connection);
        return res.json({ response });
      }
    }

    return res.json({
      response: "Lo siento, no comprendí tu mensaje.\nPuedes escribirme cosas como:\n- ¿Cuánto cuesta alquilar la sala cahuita?\n- ¿Qué incluye el servicio de transporte?\n- ¿Tienen luces disponibles?\n\nEstoy aquí para ayudarte "
    });

  } catch (error) {
    console.error("Error en chatbot:", error);
    return res.status(500).json({ response: "Ocurrió un error al procesar tu mensaje." });
  } finally {
    if (connection) await connection.close();
  }
};
