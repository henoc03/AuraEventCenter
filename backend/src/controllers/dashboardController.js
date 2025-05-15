/**
 * @abstract Controlador encargado de proporcionar los datos asociados al
 * dashboard del usuario administrador.
 * @copyright BugBusters team 2025, Universidad de Costa Rica.
 */

// Importa la conexión y el driver de Oracle configurados previamente
const { getConnection, oracledb } = require('../config/db');

/**
 * Obtiene estadísticas principales para el dashboard:
 * - Total usuarios registrados
 * - Número de salas activas
 * - Eventos reservados en la semana actual
 * 
 * Responde con un JSON que contiene estas estadísticas.
 */
exports.getDashboardStats = async (req, res) => {
  let conn;
  try {
    // Obtiene una conexión a la base de datos
    conn = await getConnection();

    // Ejecuta simultáneamente las 3 consultas principales
    const [usersRes, roomsRes, bookingsRes] = await Promise.all([
      // Cuenta total de usuarios en CLIENT_SCHEMA.USERS
      conn.execute(
        `SELECT COUNT(*) AS USERS FROM CLIENT_SCHEMA.USERS`, 
        [], 
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      // Cuenta de salas activas (ACTIVE = 1) en ADMIN_SCHEMA.ZONES
      conn.execute(
        `SELECT COUNT(*) AS ACTIVE_ROOMS FROM ADMIN_SCHEMA.ZONES WHERE ACTIVE = 1`, 
        [], 
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      ),
      // Cuenta de eventos con fecha de inicio dentro de la semana actual
      conn.execute(
        `SELECT COUNT(*) AS EVENTS_THIS_WEEK
         FROM CLIENT_SCHEMA.BOOKINGS
         WHERE START_TIME >= TRUNC(SYSDATE, 'IW')
           AND START_TIME < TRUNC(SYSDATE + 7, 'IW')`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
    ]);

    // Enviar la respuesta con los datos extraídos
    res.json({
      users: usersRes.rows[0].USERS,
      activeRooms: roomsRes.rows[0].ACTIVE_ROOMS,
      eventsThisWeek: bookingsRes.rows[0].EVENTS_THIS_WEEK
    });

  } catch (err) {
    // Manejo de error: log y respuesta 500 con mensaje
    console.error('❌ Error en getDashboardStats:', err);
    res.status(500).json({ error: err.message });
  } finally {
    // Siempre cerrar la conexión si fue abierta
    if (conn) await conn.close();
  }
};


/**
 * Obtiene las reservas realizadas durante la semana actual,
 * incluyendo estado, propietario y fecha formateada para Costa Rica.
 * Responde con un arreglo JSON de reservas.
 */
exports.getWeeklyReservations = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    // Consulta reservas en la semana actual ordenadas por fecha descendente
    const result = await conn.execute(
      `SELECT STATUS, USER_ID, START_TIME
       FROM CLIENT_SCHEMA.BOOKINGS
       WHERE START_TIME >= TRUNC(SYSDATE, 'IW')
         AND START_TIME < TRUNC(SYSDATE + 7, 'IW')
       ORDER BY START_TIME DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Mapea filas a un formato más legible para el cliente
    const reservations = result.rows.map(row => ({
      status: row.STATUS,
      owner: row.USER_ID,
      date: new Date(row.START_TIME).toLocaleDateString('es-CR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));

    res.json(reservations);

  } catch (err) {
    console.error('❌ Error al obtener reservas semanales:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


/**
 * Obtiene todos los usuarios del tipo "cliente" en CLIENT_SCHEMA.USERS.
 * Responde con un arreglo JSON con los datos básicos de los clientes.
 */
exports.getAllClients = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, USER_TYPE , ACTIVE
       FROM CLIENT_SCHEMA.USERS WHERE USER_TYPE = 'cliente'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


/**
 * Obtiene todos los usuarios del tipo "admin" en CLIENT_SCHEMA.USERS.
 * Responde con un arreglo JSON con los datos básicos de los administradores.
 */
exports.getAllAdmins = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, USER_TYPE, ACTIVE
       FROM CLIENT_SCHEMA.USERS
       WHERE USER_TYPE = 'admin'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error('❌ Error al obtener administradores:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


/**
 * Obtiene las 5 salas más reservadas junto con el número de reservas,
 * basándose en la relación entre BOOKINGS y ZONES.
 * Responde con un arreglo JSON ordenado descendentemente por cantidad de reservas.
 */
exports.getMostBookedRooms = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT a.NAME AS ROOM_NAME, COUNT(b.BOOKING_ID) AS RESERVATIONS
       FROM CLIENT_SCHEMA.BOOKINGS b
       JOIN ADMIN_SCHEMA.ZONES a ON b.ZONE_ID = a.ZONE_ID
       GROUP BY a.NAME
       ORDER BY RESERVATIONS DESC
       FETCH FIRST 5 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);

  } catch (err) {
    console.error('❌ Error al obtener salas más reservadas:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
