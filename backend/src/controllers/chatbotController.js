const { getConnection } = require('../config/db');

// Intentos básicos
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

// ======================
// ANALIZADOR DE MENSAJES
// ======================
function analizarMensaje(msg) {
  const lower = msg.toLowerCase().trim();

  // Detectar intención precio con variantes
  const precioMatch = lower.match(/(cu[aá]nto (cuesta|vale)|precio) (alquilar )?(el|la)?\s*(.*)/);
  if (precioMatch) {
    return { intent: 'consultar_precio', nombre: limpiarTexto(precioMatch[5]) };
  }

  // Intención detalles
  const detallesMatch = lower.match(/(qu[eé] incluye|detalles|informaci[oó]n sobre|en qu[eé] consiste) (el|la)?\s*(.*)/);
  if (detallesMatch) {
    return { intent: 'detalles_servicio', nombre: limpiarTexto(detallesMatch[3]) };
  }

  // Intención disponibilidad
const disponibilidadMatch = lower.match(
  /(est[aá] disponible|hay disponibilidad)(?: de)? (?:la |el )?(.+?)(?: para el)? (\d{4}-\d{2}-\d{2})/
);

  if (disponibilidadMatch) {
    return {
      intent: 'ver_disponibilidad',
      nombre: limpiarTexto(disponibilidadMatch[2]),
      fecha: disponibilidadMatch[3]
    };
  }

  // Intención cotizar con extracción opcional
const cotizarMatch = lower.match(/cotizaci[oó]n|cu[aá]nto en total|presupuesto|cotizar/);
if (cotizarMatch) {
  const salaMatch = lower.match(/sala (\w+)/);
  const serviciosMatch = lower.match(/servicios? (.+)/);

  return {
    intent: 'cotizar',
    sala: salaMatch ? salaMatch[1] : null,
    servicios: serviciosMatch ? serviciosMatch[1].split(/\s*[,y]\s*/) : []
  };
}

  // Intentos básicos (zonas, servicios, equipos, saludo)
  for (const intent of intents) {
    if (intent.keywords.test(lower)) {
      return { intent: intent.keywords.toString() };
    }
  }

  return null;
}

function limpiarTexto(texto) {
  return texto
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?.,!]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(el|la)?\s*(servicio|zona|sala|salon|espacio|equipo)?\s*(de)?\s*/i, '')
    .trim();
}

// =====================
// BÚSQUEDA TOLERANTE A ERRORES
// =====================
async function buscarPorNombre(connection, tabla, campo, entrada) {
  const result = await connection.execute(`SELECT ${campo} FROM ADMIN_SCHEMA.${tabla}`);
  let mejorCoincidencia = '';
  let menorDistancia = Infinity;

  for (const [nombre] of result.rows) {
    const distancia = levenshtein(entrada.toLowerCase(), nombre.toLowerCase());
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      mejorCoincidencia = nombre;
    }
  }
  return { mejorCoincidencia, menorDistancia };
}

// =====================
// DISTANCIA DE LEVENSHTEIN
// =====================
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
    }
  }
  return dp[a.length][b.length];
}

// =====================
// RESPUESTA PRINCIPAL
// =====================
exports.chatbotResponse = async (req, res) => {
  const { message, context } = req.body;
  const lowerMsg = message.toLowerCase().trim();
  let connection;

  try {
    connection = await getConnection();

    // Función auxiliar para búsqueda difusa con sugerencia
    async function buscarEntidadConSugerencia(tabla, nombre) {
      const resultado = await buscarPorNombre(connection, tabla, 'NAME', nombre);
      if (resultado.menorDistancia > 3) {
        return {
          encontrado: false,
          sugerencia: resultado.mejorCoincidencia
        };
      }
      return { encontrado: true, nombre: resultado.mejorCoincidencia };
    }

    // 1. Manejo de contexto pendiente (confirmaciones)
    if (context?.pendingIntent && context?.pendingName) {
      if (["sí", "si", "s"].includes(lowerMsg)) {
        const intent = context.pendingIntent;
        const nombre = context.pendingName;

        if (intent === 'consultar_precio') {
          const result = await connection.execute(`
            SELECT NAME, PRICE FROM ADMIN_SCHEMA.ZONES WHERE LOWER(NAME) = :name
            UNION ALL
            SELECT NAME, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) = :name
            UNION ALL
            SELECT NAME, UNITARY_PRICE as PRICE FROM ADMIN_SCHEMA.EQUIPMENTS WHERE LOWER(NAME) = :name
          `, [nombre.toLowerCase(), nombre.toLowerCase(), nombre.toLowerCase()]);

          if (result.rows.length === 0) {
            return res.json({ response: `No encontré información de precio para "${nombre}".`, context: {} });
          }

          const [NAME, PRICE] = result.rows[0];
          return res.json({
            response: `El precio de ${NAME} es $${PRICE}. ¿Deseas más información o disponibilidad?`,
            context: {}
          });
        }

        if (intent === 'detalles_servicio') {
          const result = await connection.execute(
            `SELECT NAME, DESCRIPTION FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) = :name`,
            [nombre.toLowerCase()]
          );

          if (result.rows.length === 0) {
            return res.json({ response: `No encontré detalles para "${nombre}".`, context: {} });
          }

          const [NAME, DESCRIPTION] = result.rows[0];
          return res.json({
            response: `El servicio ${NAME} incluye:\n\n${DESCRIPTION}`,
            context: {}
          });
        }

        if (intent === 'ver_disponibilidad') {
          if (!context.pendingDate) {
            return res.json({
              response: `Por favor, indica la fecha para consultar la disponibilidad de "${nombre}" en formato YYYY-MM-DD.`,
              context: { pendingIntent: 'ver_disponibilidad', pendingName: nombre }
            });
          }

          // Validar nombre con fuzzy
          const zona = await buscarEntidadConSugerencia('ZONES', nombre);
          if (!zona.encontrado) {
            return res.json({
              response: `No encontré una sala llamada "${nombre}". ¿Querías decir "${zona.sugerencia}"? Responde sí o no.`,
              context: {
                pendingIntent: 'ver_disponibilidad',
                pendingName: zona.sugerencia,
                pendingDate: context.pendingDate
              }
            });
          }

          // Consulta disponibilidad
          const disp = await connection.execute(
            `SELECT COUNT(*) FROM CLIENT_SCHEMA.BOOKINGS_ZONES bz
             JOIN CLIENT_SCHEMA.BOOKINGS b ON b.BOOKING_ID = bz.BOOKING_ID
             JOIN ADMIN_SCHEMA.ZONES z ON z.ZONE_ID = bz.ZONE_ID
             WHERE LOWER(z.NAME) = :name AND b.EVENT_DATE = TO_DATE(:fecha, 'YYYY-MM-DD')`,
            [zona.nombre.toLowerCase(), context.pendingDate]
          );

          if (disp.rows[0][0] > 0) {
            return res.json({
              response: `La sala ${zona.nombre} NO está disponible el ${context.pendingDate}. ¿Quieres consultar otra sala o fecha?`,
              context: {}
            });
          } else {
            return res.json({
              response: `El area ${zona.nombre} está disponible el ${context.pendingDate}. ¿Quieres hacer la reserva?`,
              context: {}
            });
          }
        }

if (intent === 'cotizar') {
  const salaNombre = nombre.toLowerCase();
  const servicios = context.pendingServices || [];

  // Buscar sala y obtener precio
  const salaResult = await connection.execute(
    `SELECT NAME, PRICE FROM ADMIN_SCHEMA.ZONES WHERE LOWER(NAME) = :name`,
    [salaNombre]
  );

  if (salaResult.rows.length === 0) {
    return res.json({
      response: `No encontré la sala "${nombre}". ¿Puedes verificar el nombre?`,
      context: {}
    });
  }

  const [salaNombreReal, salaPrecio] = salaResult.rows[0];

  let serviciosDetalle = '';
  let totalServicios = 0;

  if (servicios.length > 0) {
    for (const servicio of servicios) {
      const servicioResult = await connection.execute(
        `SELECT NAME, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) = :name`,
        [servicio.toLowerCase()]
      );

      if (servicioResult.rows.length > 0) {
        const [servicioNombre, servicioPrecio] = servicioResult.rows[0];
        serviciosDetalle += `\n• ${servicioNombre}: $${servicioPrecio}`;
        totalServicios += servicioPrecio;
      } else {
        serviciosDetalle += `\n• ${servicio} (no encontrado)`;
      }
    }
  }

  const total = salaPrecio + totalServicios;

  return res.json({
    response: `Aquí tienes la cotización para la sala "${salaNombreReal}":\n\n• Sala: $${salaPrecio}${serviciosDetalle}\n\n Total estimado: $${total}`,
    context: {}
  });
}


        // Respuesta para intentos no reconocidos en contexto pendiente
        return res.json({
          response: 'No entendí tu confirmación, ¿puedes reformularla?',
          context: {}
        });
      }

      if (["no", "n", "nop"].includes(lowerMsg)) {
        return res.json({ response: 'De acuerdo, ¿en qué más puedo ayudarte?', context: {} });
      }

      // Si no es sí/no, pedir aclaración
      return res.json({
        response: 'Por favor responde sí o no para continuar.',
        context
      });
    }

    // 2. Analizar intención con función externa
    const analisis = analizarMensaje(message);

    if (!analisis) {
      return res.json({ response: 'Lo siento, no entendí tu consulta. ¿Puedes preguntarme otra cosa?', context: {} });
    }

    // 3. Manejar intentos por intención detectada

    // Cotizar sala + servicios
    if (analisis.intent === 'cotizar') {
      const salaNombre = analisis.sala?.toLowerCase() || null;
      const serviciosNombres = analisis.servicios?.map(s => s.toLowerCase()) || [];

      if (!salaNombre) {
        return res.json({
          response: 'Por favor indica el nombre de la sala para la cotización.',
          context: { pendingIntent: 'cotizar' }
        });
      }

      // Buscar sala con fuzzy
      // Buscar servicios válidos
      const serviciosEncontrados = [];
      for (const servNombre of serviciosNombres) {
        const serv = await buscarEntidadConSugerencia('ADDITIONAL_SERVICES', servNombre);
        if (serv.encontrado) {
          serviciosEncontrados.push(serv.nombre);
        }
      }
      const sala = await buscarEntidadConSugerencia('ZONES', salaNombre);
      if (!sala.encontrado) {
        return res.json({
          response: `No encontré la sala "${salaNombre}". ¿Querías decir "${sala.sugerencia}"? Responde sí o no.`,
          context: { pendingIntent: 'cotizar', pendingName: sala.sugerencia, pendingServices: serviciosEncontrados }
        });
      }

      

      // Obtener precios
      const salaResult = await connection.execute(
        `SELECT NAME, PRICE FROM ADMIN_SCHEMA.ZONES WHERE LOWER(NAME) = :name`,
        [sala.nombre.toLowerCase()]
      );

      if (salaResult.rows.length === 0) {
        return res.json({ response: 'No encontré el precio de la sala.', context: {} });
      }

      let total = salaResult.rows[0][1];
      let respuesta = `Sala ${salaResult.rows[0][0]}: $${total}\n`;

      if (serviciosEncontrados.length > 0) {
        const binds = serviciosEncontrados.map((_, i) => `:s${i}`).join(',');
        const bindsValues = serviciosEncontrados.map(s => s.toLowerCase());

        const serviciosResult = await connection.execute(
          `SELECT NAME, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) IN (${binds})`,
          bindsValues
        );

        respuesta += 'Servicios:\n';
        for (const [nombreServ, precioServ] of serviciosResult.rows) {
          total += precioServ;
          respuesta += `• ${nombreServ}: $${precioServ}\n`;
        }
      }

      respuesta += `\nPrecio total: $${total}\n¿Quieres verificar disponibilidad o hacer la reserva?`;

      return res.json({ response: respuesta, context: {} });
    }

    // Consultar precio individual
    if (analisis.intent === 'consultar_precio') {
      const nombre = analisis.nombre.toLowerCase();
      const result = await connection.execute(`
        SELECT NAME, PRICE FROM ADMIN_SCHEMA.ZONES WHERE LOWER(NAME) = :name
        UNION ALL
        SELECT NAME, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) = :name
        UNION ALL
        SELECT NAME, UNITARY_PRICE as PRICE FROM ADMIN_SCHEMA.EQUIPMENTS WHERE LOWER(NAME) = :name
      `, [nombre, nombre, nombre]);

      if (result.rows.length === 0) {
        // No encontrado, preguntar si quiso decir otro
        const sugerenciaZona = await buscarEntidadConSugerencia('ZONES', nombre);
        const sugerenciaServicio = await buscarEntidadConSugerencia('ADDITIONAL_SERVICES', nombre);

        const sugerencia = (sugerenciaZona.encontrado ? null : sugerenciaZona.sugerencia)
          || (sugerenciaServicio.encontrado ? null : sugerenciaServicio.sugerencia);

        if (sugerencia) {
          return res.json({
            response: `No encontré "${nombre}". ¿Querías decir "${sugerencia}"? Responde sí o no.`,
            context: { pendingIntent: 'consultar_precio', pendingName: sugerencia }
          });
        }

        return res.json({ response: `No encontré información de precio para "${nombre}".`, context: {} });
      }

      const [NAME, PRICE] = result.rows[0];
      return res.json({ response: `El precio de ${NAME} es $${PRICE}.`, context: {} });
    }

    // Consultar detalles de servicio
    if (analisis.intent === 'detalles_servicio') {
      const nombre = analisis.nombre.toLowerCase();
      const result = await connection.execute(
        `SELECT NAME, DESCRIPTION FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE LOWER(NAME) = :name`,
        [nombre]
      );

      if (result.rows.length === 0) {
        // Buscar sugerencia fuzzy
        const sugerencia = await buscarEntidadConSugerencia('ADDITIONAL_SERVICES', nombre);
        if (!sugerencia.encontrado) {
          return res.json({
            response: `No encontré detalles para "${nombre}". ¿Querías decir "${sugerencia.sugerencia}"? Responde sí o no.`,
            context: { pendingIntent: 'detalles_servicio', pendingName: sugerencia.sugerencia }
          });
        }
        return res.json({ response: `No encontré detalles para "${nombre}".`, context: {} });
      }

      const [NAME, DESCRIPTION] = result.rows[0];
      return res.json({
        response: `El servicio ${NAME} incluye:\n\n${DESCRIPTION}`,
        context: {}
      });
    }


    // Consultar disponibilidad
    if (analisis.intent === 'ver_disponibilidad') {
      if (!analisis.fecha) {
        return res.json({
          response: 'Por favor indica la fecha para consultar disponibilidad en formato YYYY-MM-DD.',
          context: { pendingIntent: 'ver_disponibilidad', pendingName: analisis.nombre }
        });
      }

      const nombre = analisis.nombre.toLowerCase();
      const zona = await buscarEntidadConSugerencia('ZONES', nombre);
      if (!zona.encontrado) {
        return res.json({
          response: `No encontré la sala "${nombre}". ¿Querías decir "${zona.sugerencia}"? Responde sí o no.`,
          context: { pendingIntent: 'ver_disponibilidad', pendingName: zona.sugerencia, pendingDate: analisis.fecha }
        });
      }

      const disp = await connection.execute(
        `SELECT COUNT(*) FROM ADMIN_SCHEMA.BOOKINGS_ZONES bz
         JOIN ADMIN_SCHEMA.BOOKINGS b ON b.ID = bz.BOOKING_ID
         JOIN ADMIN_SCHEMA.ZONES z ON z.ID = bz.ZONE_ID
         WHERE LOWER(z.NAME) = :name AND b.EVENT_DATE = TO_DATE(:fecha, 'YYYY-MM-DD')`,
        [zona.nombre.toLowerCase(), analisis.fecha]
      );

      if (disp.rows[0][0] > 0) {
        return res.json({
          response: `La sala ${zona.nombre} NO está disponible el ${analisis.fecha}.`,
          context: {}
        });
      } else {
        return res.json({
          response: `La sala ${zona.nombre} está disponible el ${analisis.fecha}.`,
          context: {}
        });
      }
    }

      for (const intentObj of intents) {
      if (intentObj.keywords.test(lowerMsg)) {
        const resp = await intentObj.handler(connection);
        return res.json({ response: resp, context: {} });
      }
    }
    // Intent no identificado
    return res.json({ response: 'Lo siento, no entendí tu consulta. ¿Puedes reformular?', context: {} });

  } catch (error) {
    console.error('Error en chatbotResponse:', error);
    return res.status(500).json({ response: 'Ocurrió un error interno, intenta más tarde.', context: {} });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error('Error cerrando conexión:', e);
      }
    }
  }
};
