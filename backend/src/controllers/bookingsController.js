/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para las reservas
 * dentro del esquema CLIENT_SCHEMA..
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Obtiene todas las reservas del sistema.
 */
exports.getAllBookings = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const bookingsResult = await conn.execute(
      `SELECT 
        B.BOOKING_ID,
        B.USER_ID,
        B.BOOKING_NAME,
        B.STATUS,
        B.ADDITIONAL_NOTE,
        B.START_TIME,
        B.END_TIME,
        B.ID_CARD,
        B.EVENT_TYPE,
        B.EVENT_DATE,
        U.FIRST_NAME,
        U.LAST_NAME_1,
        U.LAST_NAME_2,
        U.EMAIL,
        U.PHONE
      FROM CLIENT_SCHEMA.BOOKINGS B
      JOIN CLIENT_SCHEMA.USERS U ON B.USER_ID = U.USER_ID`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const bookings = [];

    for (const b of bookingsResult.rows) {
      const [zonesRes, servicesRes, menusRes, equipmentsRes] = await Promise.all([
        conn.execute(`
          SELECT Z.NAME AS ZONE_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES BZ
          JOIN ADMIN_SCHEMA.ZONES Z ON BZ.ZONE_ID = Z.ZONE_ID
          WHERE BZ.BOOKING_ID = :id`, 
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT }),

        conn.execute(`
          SELECT DISTINCT S.NAME AS SERVICE_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES BZS
          JOIN ADMIN_SCHEMA.ADDITIONAL_SERVICES S ON BZS.ADDITIONAL_SERVICE_ID = S.ADDITIONAL_SERVICE_ID
          WHERE BZS.BOOKING_ID = :id`,
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT }),

        conn.execute(`
          SELECT DISTINCT M.NAME AS MENU_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS BZM
          JOIN ADMIN_SCHEMA.CATERING_MENUS M ON BZM.MENU_ID = M.MENU_ID
          WHERE BZM.BOOKING_ID = :id`,
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT }),

        conn.execute(`
          SELECT DISTINCT E.NAME AS EQUIPMENT_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS BZE
          JOIN ADMIN_SCHEMA.EQUIPMENTS E ON BZE.EQUIPMENT_ID = E.ID
          WHERE BZE.BOOKING_ID = :id`,
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT })
      ]);

      bookings.push({
        id: b.BOOKING_ID,
        booking_name: b.BOOKING_NAME,
        status: b.STATUS,
        additional_note: b.ADDITIONAL_NOTE,
        start_time: b.START_TIME,
        end_time: b.END_TIME,
        id_card: b.ID_CARD,
        event_type: b.EVENT_TYPE,
        event_date: b.EVENT_DATE,
        owner: `${b.FIRST_NAME} ${b.LAST_NAME_1} ${b.LAST_NAME_2}`,
        email: b.EMAIL,
        phone: b.PHONE,
        zones: zonesRes.rows.map(z => z.ZONE_NAME),
        services: servicesRes.rows.map(s => s.SERVICE_NAME),
        menus: menusRes.rows.map(m => m.MENU_NAME),
        equipments: equipmentsRes.rows.map(e => e.EQUIPMENT_NAME)
      });
    }

    res.json(bookings);
  } catch (err) {
    console.error("Error al obtener reservas completas:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todas las reservas del usuario autenticado, con información completa.
 */
exports.getMyBookings = async (req, res) => {
  let conn;
  try {
    const userId = req.user.id;
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT 
        B.BOOKING_ID,
        B.BOOKING_NAME,
        B.STATUS,
        B.ADDITIONAL_NOTE,
        B.START_TIME,
        B.END_TIME,
        B.ID_CARD,
        B.EVENT_TYPE,
        B.EVENT_DATE,
        U.FIRST_NAME,
        U.LAST_NAME_1,
        U.LAST_NAME_2,
        U.EMAIL,
        U.PHONE
      FROM CLIENT_SCHEMA.BOOKINGS B
      JOIN CLIENT_SCHEMA.USERS U ON B.USER_ID = U.USER_ID
      WHERE B.USER_ID = :userId
      ORDER BY B.EVENT_DATE DESC`,
      [userId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const bookings = [];

    for (const b of result.rows) {
      const [zonesRes, servicesRes, equipmentsRes] = await Promise.all([
        conn.execute(`
          SELECT Z.NAME AS ZONE_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES BZ
          JOIN ADMIN_SCHEMA.ZONES Z ON BZ.ZONE_ID = Z.ZONE_ID
          WHERE BZ.BOOKING_ID = :id`, 
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT }),

        conn.execute(`
          SELECT DISTINCT S.NAME AS SERVICE_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES BZS
          JOIN ADMIN_SCHEMA.ADDITIONAL_SERVICES S ON BZS.ADDITIONAL_SERVICE_ID = S.ADDITIONAL_SERVICE_ID
          WHERE BZS.BOOKING_ID = :id`,
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT }),

        conn.execute(`
          SELECT DISTINCT E.NAME AS EQUIPMENT_NAME
          FROM CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS BZE
          JOIN ADMIN_SCHEMA.EQUIPMENTS E ON BZE.EQUIPMENT_ID = E.ID
          WHERE BZE.BOOKING_ID = :id`,
          [b.BOOKING_ID], { outFormat: oracledb.OUT_FORMAT_OBJECT })
      ]);

      bookings.push({
        id: b.BOOKING_ID,
        bookingName: b.BOOKING_NAME,
        status: b.STATUS,
        additionalNote: b.ADDITIONAL_NOTE,
        date: b.EVENT_DATE ? b.EVENT_DATE.toISOString().split('T')[0] : null,
        startTime: b.START_TIME ? b.START_TIME.toISOString().split('T')[1].slice(0, 8) : null,
        endTime: b.END_TIME ? b.END_TIME.toISOString().split('T')[1].slice(0, 8) : null,
        eventType: b.EVENT_TYPE,
        idCard: b.ID_CARD,
        owner: `${b.FIRST_NAME} ${b.LAST_NAME_1} ${b.LAST_NAME_2}`,
        email: b.EMAIL,
        phone: b.PHONE,
        zones: zonesRes.rows.map(z => z.ZONE_NAME),
        services: servicesRes.rows.map(s => s.SERVICE_NAME),
        equipments: equipmentsRes.rows.map(e => e.EQUIPMENT_NAME)
      });
    }

    res.json(bookings);
  } catch (err) {
    console.error("Error al obtener historial del usuario:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

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

exports.deleteBooking = async (req, res) => {
  let conn;
  try {
    const bookingId = req.params.id;
    conn = await getConnection();

    await conn.execute(
      `UPDATE CLIENT_SCHEMA.BOOKINGS 
       SET STATUS = 'cancelada' 
       WHERE BOOKING_ID = :id`,
      [bookingId]
    );

    const deleteTables = [
      'BOOKINGS_ZONES_SERVICES',
      'BOOKINGS_ZONES_MENUS',
      'BOOKINGS_ZONES_EQUIPMENTS',
      'BOOKINGS_ZONES'
    ];

    for (const table of deleteTables) {
      await conn.execute(
        `DELETE FROM CLIENT_SCHEMA.${table} 
         WHERE BOOKING_ID = :id`,
        [bookingId]
      );
    }

    await conn.commit();
    res.json({ message: "Reserva cancelada y asociaciones eliminadas." });

  } catch (err) {
    console.error("Error al cancelar reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
