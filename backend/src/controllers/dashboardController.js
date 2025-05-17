const { getConnection, oracledb } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const [usersRes, roomsRes, bookingsRes] = await Promise.all([
      conn.execute(`SELECT COUNT(*) AS USERS FROM CLIENT_SCHEMA.USERS`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }),
      conn.execute(`SELECT COUNT(*) AS ACTIVE_ROOMS FROM ADMIN_SCHEMA.ZONES WHERE ACTIVE = 1`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }),
      conn.execute(
        `SELECT COUNT(*) AS EVENTS_THIS_WEEK
         FROM CLIENT_SCHEMA.BOOKINGS
         WHERE START_TIME >= TRUNC(SYSDATE, 'IW')
         AND START_TIME < TRUNC(SYSDATE + 7, 'IW')`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      )
    ]);

    res.json({
      users: usersRes.rows[0].USERS,
      activeRooms: roomsRes.rows[0].ACTIVE_ROOMS,
      eventsThisWeek: bookingsRes.rows[0].EVENTS_THIS_WEEK
    });

  } catch (err) {
    console.error('❌ Error en getDashboardStats:', err);
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
        `SELECT STATUS, USER_ID, START_TIME
         FROM CLIENT_SCHEMA.BOOKINGS
         WHERE START_TIME >= TRUNC(SYSDATE, 'IW')
         AND START_TIME < TRUNC(SYSDATE + 7, 'IW')
         ORDER BY START_TIME DESC`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
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
