/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para las reservas
 * dentro del esquema CLIENT_SCHEMA..
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');


/**
 * Obtiene un equipo específico por ID.
 */
exports.getBookingById = async (req, res) => {
  let conn;
  try {
    const id = req.params.id;
    conn = await getConnection();

    const bookings_result = await conn.execute(
      `SELECT 
        BOOKING_ID,
        USER_ID,
        BOOKING_NAME,
        STATUS,
        ADDITIONAL_NOTE,
        START_TIME,
        END_TIME,
        ID_CARD,
        EVENT_TYPE,
        EVENT_DATE
      FROM CLIENT_SCHEMA.BOOKINGS WHERE BOOKING_ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (bookings_result.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    const booking = bookings_result.rows[0];

    const user_result = await conn.execute(
      `SELECT 
        USER_ID,
        FIRST_NAME,
        LAST_NAME_1,
        LAST_NAME_2,
        EMAIL,
        PHONE
      FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id`,
      [booking.USER_ID],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (user_result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = user_result.rows[0];

    const booking_info = {
      bookingId: booking.BOOKING_ID,
      bookingName: booking.BOOKING_NAME,
      status: booking.STATUS,
      additionalNote: booking.ADDITIONAL_NOTE,
      startTime: booking.START_TIME ? 
      `${booking.START_TIME.getHours().toString().padStart(2, '0')}:${booking.START_TIME.getMinutes().toString().padStart(2, '0')}:${booking.START_TIME.getSeconds().toString().padStart(2, '0')}` : null,
      endTime: booking.END_TIME ? 
      `${booking.END_TIME.getHours().toString().padStart(2, '0')}:${booking.END_TIME.getMinutes().toString().padStart(2, '0')}:${booking.END_TIME.getSeconds().toString().padStart(2, '0')}` : null,
      date: booking.EVENT_DATE ? booking.EVENT_DATE.toISOString().split('T')[0] : null,
      idCard: booking.ID_CARD,
      eventType: booking.EVENT_TYPE,
      owner: `${user.FIRST_NAME} ${user.LAST_NAME_1} ${user.LAST_NAME_2}`,
      email: user.EMAIL,
      phone: user.PHONE
    }

    res.json(booking_info || {});
  } catch (err) {
    console.error("Error al obtener reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todas las salas de una reserva.
 */
exports.getBookingZones= async (req, res) => {
  let conn;
  try {
    const id = req.params.id;
    conn = await getConnection();

    const zones_result = await conn.execute(
      `SELECT ZONE_ID FROM CLIENT_SCHEMA.BOOKINGS_ZONES WHERE BOOKING_ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (zones_result.rows.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    res.json(zones_result.rows || []);
  } catch (err) {
    console.error("Error al obtener reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todos los servicios de una reserva.
 */
exports.getBookingServices = async (req, res) => {
  let conn;
  try {
    const { bookingId, roomId } = req.body;
    conn = await getConnection();

    const services_result = await conn.execute(
      `SELECT ADDITIONAL_SERVICE_ID FROM CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES WHERE BOOKING_ID = :bookingId AND ZONE_ID = :roomId`,
      [bookingId, roomId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );


    const services = services_result.rows.map(service => {
      return {
        ID: service.ADDITIONAL_SERVICE_ID,
      };
    });

    res.json(services || []);
  } catch (err) {
    console.error("Error al obtener los servicios de la reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todos los menús de una reserva.
 */
exports.getBookingMenus = async (req, res) => {
  let conn;
  try {
    const { bookingId, roomId } = req.body;
    conn = await getConnection();

    const menus_result = await conn.execute(
      `SELECT MENU_ID FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS WHERE BOOKING_ID = :bookingId AND ZONE_ID = :roomId`,
      [bookingId, roomId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const menus = menus_result.rows.map(menu => {
      return {
        ID: menu.MENU_ID,
      };
    });

    res.json(menus || []);
  } catch (err) {
    console.error("Error al obtener los menús de la reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todos los equipos de una reserva.
 */
exports.getBookingEquipments = async (req, res) => {
  let conn;
  try {
    const { bookingId, roomId } = req.body;
    conn = await getConnection();

    const equipments_result = await conn.execute(
      `SELECT EQUIPMENT_ID FROM CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS WHERE BOOKING_ID = :bookingId AND ZONE_ID = :roomId`,
      [bookingId, roomId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const equipments = equipments_result.rows.map(equipment => {
      return {
        ID: equipment.EQUIPMENT_ID,
      };
    });

    res.json(equipments || []);
  } catch (err) {
    console.error("Error al obtener los equipos de la reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
