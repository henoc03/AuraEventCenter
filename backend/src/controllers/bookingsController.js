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

exports.updateBookingStatuses = async () => {
  let conn;
  try {
    conn = await getConnection();

    // 1. Obtener todas las reservas relevantes con sus fechas y horas
    const result = await conn.execute(`
      SELECT BOOKING_ID, STATUS, EVENT_DATE, START_TIME, END_TIME
      FROM CLIENT_SCHEMA.BOOKINGS
      WHERE STATUS IN ('pendiente', 'en_progreso')
    `);

    const now = new Date();

    for (const row of result.rows) {
      const [bookng_id, status, eventDate, startTime, endTime] = row;

      // Combinar EVENT_DATE con horas
      const startDateTime = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
        startTime.getSeconds()
      );

      const endDateTime = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
        endTime.getSeconds()
      );

      let newStatus = null;

      if (status === 'pendiente') {
        if (now >= startDateTime) {
          newStatus = 'en_progreso';
        } else if (now > endDateTime) {
          // Si ya pasó el evento y no se inició, cancelar
          newStatus = 'cancelada';
        }
      } else if (status === 'en_progreso' && now >= endDateTime) {
        newStatus = 'completada';
      }

      // Actualizar estado solo si cambió
      if (newStatus && newStatus !== status) {
        await conn.execute(
          `UPDATE CLIENT_SCHEMA.BOOKINGS SET STATUS = :newStatus WHERE BOOKING_ID = :bookng_id`,
          { newStatus, bookng_id },
          { autoCommit: false }
        );
      }
    }

    await conn.commit();

    console.log(`[CRON] Estados de reservas actualizados correctamente`);
  } catch (err) {
    console.error('[CRON] Error al actualizar estados de reservas:', err.message);
  } finally {
    if (conn) await conn.close();
  }
};

exports.createBooking = async (req, res) => {
  let conn;
  try {
    const { userId, bookingInfo, rooms, services, menus, equipments } = req.body;

    conn = await getConnection();

    const {
      owner, bookingName, idCard, email, phone,
      eventType, startTime, endTime, date, additionalNote
    } = bookingInfo;

const result = await conn.execute(
  `BEGIN
     INSERT INTO CLIENT_SCHEMA.BOOKINGS (
       USER_ID, BOOKING_NAME, STATUS, ADDITIONAL_NOTE,
       START_TIME, END_TIME, ID_CARD, EVENT_TYPE, EVENT_DATE
     ) VALUES (
       :userId, :bookingName, 'pendiente', :note,
       TO_DATE(:startTime, 'HH24:MI'), TO_DATE(:endTime, 'HH24:MI'),
       :idCard, :eventType, TO_DATE(:eventDate, 'YYYY-MM-DD')
     )
     RETURNING BOOKING_ID INTO :outBookingId;
   END;`,
  {
    userId,
    bookingName,
    note: additionalNote,
    startTime,
    endTime,
    idCard,
    eventType,
    eventDate: date,
    outBookingId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
  },
  { autoCommit: false }
);

const bookingId = result.outBinds.outBookingId;


    for (const zoneId of rooms) {

      await conn.execute(
        `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES (BOOKING_ID, ZONE_ID)
         VALUES (:bookingId, :zoneId)`,
        { bookingId, zoneId },
        { autoCommit: false }
      );

  
      const zoneServices = services?.[zoneId] || [];
      for (const serviceId of zoneServices) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES (BOOKING_ID, ZONE_ID, ADDITIONAL_SERVICE_ID)
           VALUES (:bookingId, :zoneId, :serviceId)`,
          { bookingId, zoneId, serviceId },
          { autoCommit: false }
        );
      }

 
      const zoneMenus = menus?.[zoneId] || [];
      for (const menuId of zoneMenus) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS (BOOKING_ID, ZONE_ID, MENU_ID)
           VALUES (:bookingId, :zoneId, :menuId)`,
          { bookingId, zoneId, menuId },
          { autoCommit: false }
        );
      }


      const zoneEquipments = equipments?.[zoneId] || [];
      for (const equipmentId of zoneEquipments) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS (BOOKING_ID, ZONE_ID, EQUIPMENT_ID)
           VALUES (:bookingId, :zoneId, :equipmentId)`,
          { bookingId, zoneId, equipmentId },
          { autoCommit: false }
        );
      }
    }

    await conn.commit();

    res.status(201).json({ message: "Reserva creada exitosamente", bookingId });

  } catch (err) {
    console.error("Error al crear reserva:", err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: "Error al crear la reserva" });
  } finally {
    if (conn) await conn.close();
  }
};

