const { getConnection, oracledb } = require("../config/db");

exports.createBooking = async (req, res) => {
  const {
    userId,
    status,
    additionalNote,
    startTime,
    endTime,
    bookingName,
    idCard,
    eventType,
    eventDate,
    zones, // Array de objetos con { zoneId, menuId, serviceIds[], equipmentIds[] }
  } = req.body;

  let conn;

  try {
    conn = await getConnection();

    // 1. Insertar en BOOKINGS
    const result = await conn.execute(
      `INSERT INTO CLIENT_SCHEMA.BOOKINGS
        (USER_ID, STATUS, ADDITIONAL_NOTE, START_TIME, END_TIME, BOOKING_NAME, ID_CARD, EVENT_TYPE, EVENT_DATE)
       VALUES (:userId, :status, :additionalNote, :startTime, :endTime, :bookingName, :idCard, :eventType, :eventDate)
       RETURNING BOOKING_ID INTO :bookingId`,
      {
        userId,
        status,
        additionalNote,
        startTime,
        endTime,
        bookingName,
        idCard,
        eventType,
        eventDate,
        bookingId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false }
    );

    const bookingId = result.outBinds.bookingId[0];

    // 2. Insertar zonas, menús, servicios, equipamiento
    for (const zone of zones) {
      const { zoneId, menuId, serviceIds = [], equipmentIds = [] } = zone;

      // Insertar relación zona + menú
      if (menuId) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS (BOOKING_ID, ZONE_ID, MENU_ID)
           VALUES (:bookingId, :zoneId, :menuId)`,
          { bookingId, zoneId, menuId },
          { autoCommit: false }
        );
      }

      // Insertar servicios adicionales
      for (const serviceId of serviceIds) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES (BOOKING_ID, ZONE_ID, ADDITIONAL_SERVICE_ID)
           VALUES (:bookingId, :zoneId, :serviceId)`,
          { bookingId, zoneId, serviceId },
          { autoCommit: false }
        );
      }

      // Insertar equipamiento
      for (const equipmentId of equipmentIds) {
        await conn.execute(
          `INSERT INTO CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS (BOOKING_ID, ZONE_ID, EQUIPMENT_ID)
           VALUES (:bookingId, :zoneId, :equipmentId)`,
          { bookingId, zoneId, equipmentId },
          { autoCommit: false }
        );
      }
    }

    await conn.commit();

    res.status(201).json({ bookingId, message: "Reserva creada exitosamente." });
  } catch (err) {
    console.error("❌ Error al crear reserva:", err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.getBookingDetailForInvoice = async (req, res) => {
  const bookingId = req.params.bookingId;
  let conn;

  try {
    conn = await getConnection();

    // 1. Datos generales del booking
    const bookingResult = await conn.execute(
      `SELECT B.BOOKING_ID, B.USER_ID, B.STATUS, B.BOOKING_NAME, B.EVENT_TYPE,
              B.EVENT_DATE, B.START_TIME, B.END_TIME, B.ADDITIONAL_NOTE, B.ID_CARD
       FROM CLIENT_SCHEMA.BOOKINGS B
       WHERE B.BOOKING_ID = :bookingId`,
      [bookingId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const booking = bookingResult.rows[0];
    if (!booking) return res.status(404).json({ message: "Reserva no encontrada." });

    // 2. Zonas + precio
    const zonesResult = await conn.execute(
      `SELECT Z.ZONE_ID, Z.NAME, Z.PRICE
       FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS BZM
       JOIN ADMIN_SCHEMA.ZONES Z ON BZM.ZONE_ID = Z.ZONE_ID
       WHERE BZM.BOOKING_ID = :bookingId`,
      [bookingId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 3. Menús por zona
    const menusResult = await conn.execute(
      `SELECT BZM.ZONE_ID, M.MENU_ID, M.NAME, M.PRICE
       FROM CLIENT_SCHEMA.BOOKINGS_ZONES_MENUS BZM
       JOIN ADMIN_SCHEMA.CATERING_MENUS M ON BZM.MENU_ID = M.MENU_ID
       WHERE BZM.BOOKING_ID = :bookingId`,
      [bookingId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 4. Servicios adicionales por zona
    const servicesResult = await conn.execute(
      `SELECT BZS.ZONE_ID, S.ADDITIONAL_SERVICE_ID, S.NAME, S.PRICE
       FROM CLIENT_SCHEMA.BOOKINGS_ZONES_SERVICES BZS
       JOIN ADMIN_SCHEMA.ADDITIONAL_SERVICES S ON BZS.ADDITIONAL_SERVICE_ID = S.ADDITIONAL_SERVICE_ID
       WHERE BZS.BOOKING_ID = :bookingId`,
      [bookingId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 5. Equipos por zona
    const equipmentsResult = await conn.execute(
      `SELECT BZE.ZONE_ID, E.ID AS EQUIPMENT_ID, E.NAME, E.UNITARY_PRICE
       FROM CLIENT_SCHEMA.BOOKINGS_ZONES_EQUIPMENTS BZE
       JOIN ADMIN_SCHEMA.EQUIPMENTS E ON BZE.EQUIPMENT_ID = E.ID
       WHERE BZE.BOOKING_ID = :bookingId`,
      [bookingId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Agrupación y cálculo
    let total = 0;
    const zonas = [];

    for (const zone of zonesResult.rows) {
      const zoneMenus = menusResult.rows.filter(m => m.ZONE_ID === zone.ZONE_ID);
      const zoneServices = servicesResult.rows.filter(s => s.ZONE_ID === zone.ZONE_ID);
      const zoneEquipments = equipmentsResult.rows.filter(e => e.ZONE_ID === zone.ZONE_ID);

      const zoneTotal =
        Number(zone.PRICE || 0) +
        zoneMenus.reduce((acc, m) => acc + Number(m.PRICE || 0), 0) +
        zoneServices.reduce((acc, s) => acc + Number(s.PRICE || 0), 0) +
        zoneEquipments.reduce((acc, e) => acc + Number(e.UNITARY_PRICE || 0), 0);

      total += zoneTotal;

      zonas.push({
        zoneId: zone.ZONE_ID,
        name: zone.NAME,
        basePrice: zone.PRICE,
        menus: zoneMenus,
        services: zoneServices,
        equipments: zoneEquipments,
        subtotal: zoneTotal,
      });
    }

    res.status(200).json({
      booking,
      zonas,
      total,
    });
  } catch (err) {
    console.error("❌ Error al obtener detalles de reserva:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};