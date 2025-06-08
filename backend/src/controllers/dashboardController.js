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
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN
         ADMIN_SCHEMA.DASHBOARD_PKG.GET_DASHBOARD_STATS(:p_users, :p_rooms, :p_events);
       END;`,
      {
        p_users: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        p_rooms: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        p_events: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    res.json({
      users: result.outBinds.p_users,
      activeRooms: result.outBinds.p_rooms,
      eventsThisWeek: result.outBinds.p_events
    });

  } catch (err) {
    console.error('Error en getDashboardStats:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


exports.getWeeklyReservations = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN
         ADMIN_SCHEMA.DASHBOARD_PKG.GET_WEEKLY_RESERVATIONS(:p_cursor);
       END;`,
      {
        p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const resultSet = result.outBinds.p_cursor;

    const rows = await resultSet.getRows();

    await resultSet.close();

const reservations = rows.map(row => {

    return {
      status: row[0],
      owner: row[1],
      date: new Date(row[2]).toLocaleDateString('es-CR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };
  });


    res.json(reservations);

  } catch (err) {
    console.error('Error al obtener reservas semanales:', err);
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
      `BEGIN ADMIN_SCHEMA.DASHBOARD_PKG.GET_ALL_CLIENTS(:cursor); END;`,
      {
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
        {
    outFormat: oracledb.OUT_FORMAT_OBJECT
  }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    res.json(rows);

  } catch (err) {
    console.error("Error al obtener clientes:", err);
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
      `BEGIN ADMIN_SCHEMA.DASHBOARD_PKG.GET_ALL_ADMINS(:cursor); END;`,
      {
        cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      }
    );

    const resultSet = result.outBinds.cursor;
    const rows = await resultSet.getRows();
    await resultSet.close();

    res.json(rows);

  } catch (err) {
    console.error("Error al obtener administradores:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};



/**
 * Obtiene las 5 salas más reservadas utilizando el procedimiento almacenado
 * ADMIN_SCHEMA.DASHBOARD_PKG.GET_TOP_BOOKED_ROOMS.
 * Responde con un arreglo JSON con el nombre de la sala y la cantidad de reservas,
 * ordenado descendentemente por cantidad de reservas.
 */
exports.getMostBookedRooms = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN
         ADMIN_SCHEMA.DASHBOARD_PKG.GET_TOP_BOOKED_ROOMS(:p_cursor);
       END;`,
      {
        p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      }
    );

    const resultSet = result.outBinds.p_cursor;
    const rows = await resultSet.getRows();

    await resultSet.close();

    const topRooms = rows.map(row => ({
      roomName: row[0],
      reservations: row[1]
    }));

    res.json(topRooms);

  } catch (err) {
    console.error('Error al obtener salas más reservadas:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

