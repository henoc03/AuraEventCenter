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
      `SELECT MENU_ID, QUANTITY FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS WHERE BOOKING_ID = :bookingId AND ZONE_ID = :roomId`,
      [bookingId, roomId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Devuelve [{ ID_MENU, CANTIDAD }]
    const menus = menus_result.rows.map(menu => ({
      ID_MENU: menu.MENU_ID,
      CANTIDAD: menu.QUANTITY
    }));

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
      console.log(zoneMenus)
      for (const { ID_MENU, CANTIDAD } of zoneMenus) {
  await conn.execute(
    `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS (
      BOOKING_ID, ZONE_ID, MENU_ID, QUANTITY
    ) VALUES (
      :bookingId, :zoneId, :menuId, :quantity
    )`,
    {
      bookingId,
      zoneId,
      menuId: ID_MENU,
      quantity: CANTIDAD
    },
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

    // Después de crear la reserva y obtener bookingId:
    const currentPayment = req.body.currentPayment || 0; // O calcula el total en backend si prefieres

    await conn.execute(
      `INSERT INTO CLIENT_SCHEMA.INVOICES (USER_ID, BOOKING_ID, CURRENT_PAYMENT, INVOICE_DATE, INVOICE_STATUS)
       VALUES (:userId, :bookingId, :currentPayment, SYSDATE, 'pago')`,
      {
        userId,
        bookingId,
        currentPayment
      },
      { autoCommit: false }
    );

    await conn.commit();

    res.status(201).json({ message: "Reserva y factura creadas exitosamente", bookingId });

  } catch (err) {
    console.error("Error al crear reserva:", err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: "Error al crear la reserva" });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateBooking = async (req, res) => {
  let conn;
  try {
    const { userId, bookingId, bookingInfo, rooms, services, menus, equipments } = req.body;
    console.log(services);

    conn = await getConnection();

    const {
      owner, bookingName, idCard, email, phone,
      eventType, startTime, endTime, date, additionalNote
    } = bookingInfo;

    const cleanTime = t => t.length > 5 ? t.slice(0,5) : t;
    const startTimeOnly = cleanTime(startTime);
    const endTimeOnly = cleanTime(endTime);

    const result = await conn.execute(
      `UPDATE CLIENT_SCHEMA.BOOKINGS
       SET
        USER_ID = :userId,
        BOOKING_NAME = :bookingName,
        STATUS = 'pendiente',
        ADDITIONAL_NOTE = :note,
        START_TIME = TO_DATE(:startTime, 'HH24:MI'),
        END_TIME = TO_DATE(:endTime, 'HH24:MI'),
        ID_CARD = :idCard,
        EVENT_TYPE = :eventType,
        EVENT_DATE = TO_DATE(:eventDate, 'YYYY-MM-DD')
       WHERE BOOKING_ID = :bookingId`,
      {
        userId: userId,
        bookingName: bookingName,
        note: additionalNote,
        startTime: startTimeOnly,
        endTime: endTimeOnly,
        idCard: idCard,
        eventType: eventType,
        eventDate: date,
        bookingId: bookingId
      },
      { autoCommit: false }
    );

    for (const zoneId of rooms) {
      // Verifica si ya existe la sala para la reserva
      const exists = await conn.execute(
        `SELECT 1 FROM CLIENT_SCHEMA.BOOKINGS_ZONES WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId`,
        { bookingId, zoneId }
      );
      if (exists.rows.length === 0) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES (BOOKING_ID, ZONE_ID) VALUES (:bookingId, :zoneId)`,
          { bookingId, zoneId },
          { autoCommit: false }
        );
      }

      const zoneServices = services?.[zoneId] || [];
      for (const serviceId of zoneServices) {
        const exists = await conn.execute(
          `SELECT 1 FROM CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId AND ADDITIONAL_SERVICE_ID = :serviceId`,
          { bookingId, zoneId, serviceId }
        );
        if (exists.rows.length === 0) {
          await conn.execute(
            `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES (BOOKING_ID, ZONE_ID, ADDITIONAL_SERVICE_ID)
            VALUES (:bookingId, :zoneId, :serviceId)`,
            { bookingId, zoneId, serviceId },
            { autoCommit: false }
          );
        }
      }

      // 1. Obtener los menús actuales en la BD para esta zona y reserva
  const dbMenusRes = await conn.execute(
    `SELECT MENU_ID FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId`,
    { bookingId, zoneId }
  );
  const dbMenuIds = dbMenusRes.rows.map(row => row[0]);

  // 2. Unifica menús por ID_MENU y suma cantidades si hay repetidos en el payload
  const zoneMenus = menus?.[zoneId] || [];
  const menuMap = new Map();
  for (const menu of zoneMenus) {
    const key = menu.ID_MENU;
    if (menuMap.has(key)) {
      menuMap.get(key).CANTIDAD += menu.CANTIDAD || 1;
    } else {
      menuMap.set(key, { ...menu, CANTIDAD: menu.CANTIDAD || 1 });
    }
  }
  const uniqueZoneMenus = Array.from(menuMap.values());
  const payloadMenuIds = uniqueZoneMenus.map(m => m.ID_MENU);

  // 3. Eliminar menús que ya no están en el payload
  for (const dbMenuId of dbMenuIds) {
    if (!payloadMenuIds.includes(dbMenuId)) {
      await conn.execute(
        `DELETE FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS
         WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId AND MENU_ID = :menuId`,
        { bookingId, zoneId, menuId: dbMenuId },
        { autoCommit: false }
      );
    }
  }

  // 4. Insertar o actualizar los menús del payload
  for (const menu of uniqueZoneMenus) {
    const exists = await conn.execute(
      `SELECT QUANTITY FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS
       WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId AND MENU_ID = :menuId`,
      { bookingId, zoneId, menuId: menu.ID_MENU }
    );
    if (exists.rows.length === 0) {
      await conn.execute(
        `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS (BOOKING_ID, ZONE_ID, MENU_ID, QUANTITY)
         VALUES (:bookingId, :zoneId, :menuId, :quantity)`,
        { bookingId, zoneId, menuId: menu.ID_MENU, quantity: menu.CANTIDAD },
        { autoCommit: false }
      );
    } else {
      await conn.execute(
        `UPDATE CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS
         SET QUANTITY = :quantity
         WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId AND MENU_ID = :menuId`,
        { quantity: menu.CANTIDAD, bookingId, zoneId, menuId: menu.ID_MENU },
        { autoCommit: false }
      );
    }
  }

      const zoneEquipments = equipments?.[zoneId] || [];
      console.log(zoneEquipments)
      for (const equipmentId of zoneEquipments) {
        const exists = await conn.execute(
          `SELECT 1 FROM CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS WHERE BOOKING_ID = :bookingId AND ZONE_ID = :zoneId AND EQUIPMENT_ID = :equipmentId`,
          { bookingId, zoneId, equipmentId }
        );
        if (exists.rows.length === 0) {
          await conn.execute(
            `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS (BOOKING_ID, ZONE_ID, EQUIPMENT_ID) VALUES (:bookingId, :zoneId, :equipmentId)`,
            { bookingId, zoneId, equipmentId },
            { autoCommit: false }
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({ message: "Reserva actualizada exitosamente", bookingId });

  } catch (err) {
    console.error("Error al actualizar la reserva:", err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: "Error al actualizar la reserva" });
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

/**
 * Calcula el resumen de pago para una reserva en edición.
 * Espera en req.body:
 * {
 *   rooms: [zoneId, ...],
 *   menus: { [zoneId]: [menuId, ...], ... },
 *   services: { [zoneId]: [serviceId, ...], ... },
 *   equipments: { [zoneId]: [equipmentId, ...], ... }
 * }
 */
exports.getPaymentSummary = async (req, res) => {
  let conn;
  try {
    // 1. Obtén las horas de la reserva (asegúrate de recibirlas en el payload)
    const { rooms = [], menus = {}, services = {}, equipments = {}, startTime, endTime } = req.body;
    conn = await getConnection();

    // Helper para IN clause
    const makeInClause = (arr, prefix) => {
      if (!arr || arr.length === 0) return { clause: '(NULL)', binds: {} };
      const binds = {};
      const clause = arr.map((id, i) => {
        binds[`${prefix}${i}`] = id;
        return `:${prefix}${i}`;
      }).join(',');
      return { clause: `(${clause})`, binds };
    };

    // 1. Traer info de zonas/salas
    let zonas = [];
    let total = 0;

    for (const zoneId of rooms) {
      // Sala base
      const zoneRes = await conn.execute(
        `SELECT ZONE_ID, NAME, PRICE FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
        { id: zoneId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const zone = zoneRes.rows[0];
      if (!zone) continue;

      // Menús
      const menuObjs = menus[zoneId] || [];
      const menuIds = menuObjs.map(m => m.ID_MENU);
      const { clause, binds } = makeInClause(menuIds, 'menu');
      let menuList = [];
      let subtotalMenus = 0;
      if (menuIds.length > 0) {
        const menusRes = await conn.execute(
          `SELECT MENU_ID, NAME, PRICE FROM ADMIN_SCHEMA.CATERING_MENUS WHERE MENU_ID IN ${clause}`,
          binds,
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        // Multiplica el precio por la cantidad seleccionada
        menuList = menuObjs.map(selMenu => {
          const menuInfo = menusRes.rows.find(m => m.MENU_ID === selMenu.ID_MENU);
          return {
            ...menuInfo,
            CANTIDAD: selMenu.CANTIDAD,
            PRICE: (Number(menuInfo.PRICE) || 0) * (selMenu.CANTIDAD || 1)
          };
        });
        subtotalMenus = menuList.reduce((sum, m) => sum + (Number(m.PRICE) || 0), 0);
      }

      // Servicios
      const serviceIds = services[zoneId] || [];
      let serviceList = [];
      let subtotalServices = 0;
      if (serviceIds.length > 0) {
        const { clause, binds } = makeInClause(serviceIds, 'srv');
        const servicesRes = await conn.execute(
          `SELECT ADDITIONAL_SERVICE_ID, NAME, PRICE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID IN ${clause}`,
          binds,
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        serviceList = servicesRes.rows;
        subtotalServices = serviceList.reduce((sum, s) => sum + (Number(s.PRICE) || 0), 0);
      }

      // Equipos
      const equipmentIds = equipments[zoneId] || [];
      let equipmentList = [];
      let subtotalEquipments = 0;
      if (equipmentIds.length > 0) {
        const { clause, binds } = makeInClause(equipmentIds, 'eq');
        const eqRes = await conn.execute(
          `SELECT ID AS EQUIPMENT_ID, NAME, UNITARY_PRICE FROM ADMIN_SCHEMA.EQUIPMENTS WHERE ID IN ${clause}`,
          binds,
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        equipmentList = eqRes.rows;
        subtotalEquipments = equipmentList.reduce((sum, e) => sum + (Number(e.UNITARY_PRICE) || 0), 0);
      }

      // Calcula la cantidad de horas
      function getHourDelta(start, end) {
        // start y end en formato "HH:MM"
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);
        let delta = (eh + em/60) - (sh + sm/60);
        if (delta < 0) delta += 24; // por si cruza medianoche
        return delta;
      }
      const hours = getHourDelta(startTime, endTime);

      const basePrice = (Number(zone.PRICE) || 0) * hours;
      const subtotal = basePrice + subtotalMenus + subtotalServices + subtotalEquipments;
      console.log({ startTime, endTime, hours });
      
      zonas.push({
        zoneId: zone.ZONE_ID,
        name: zone.NAME,
        basePrice,
        hours,
        menus: menuList,
        services: serviceList,
        equipments: equipmentList,
        subtotal,
      });

      total += subtotal;
    }

    const iva = Math.round(total * 0.13);
    const totalConIva = total + iva;

    res.json({
      zonas,
      total,
      iva,
      totalConIva,
    });
  } catch (err) {
    console.error('Error al calcular el resumen de pago:', err);
    res.status(500).json({ message: 'Error al calcular el resumen de pago.' });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateInvoicePayment = async (req, res) => {
  let conn;
  try {
    const { bookingId, newPayment } = req.body;
    conn = await getConnection();
    await conn.execute(
      `UPDATE CLIENT_SCHEMA.INVOICES
       SET CURRENT_PAYMENT = :newPayment
       WHERE BOOKING_ID = :bookingId`,
      { newPayment, bookingId },
      { autoCommit: true }
    );
    res.json({ message: "Pago actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getInvoiceByBooking = async (req, res) => {
  let conn;
  try {
    const { bookingId } = req.params;
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT INVOICE_ID, USER_ID, BOOKING_ID, INVOICE_DATE, INVOICE_STATUS, CURRENT_PAYMENT
       FROM CLIENT_SCHEMA.INVOICES WHERE BOOKING_ID = :bookingId`,
      { bookingId }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No se encontró la factura" });
    }
    // Usa outFormat para obtener objetos, o mapea manualmente
    const row = result.rows[0];
    res.json({
      INVOICE_ID: row[0],
      USER_ID: row[1],
      BOOKING_ID: row[2],
      INVOICE_DATE: row[3],
      INVOICE_STATUS: row[4],
      CURRENT_PAYMENT: row[5]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
