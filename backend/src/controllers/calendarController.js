
const { getConnection, oracledb } = require('../config/db');
/**
 * Obtiene todas las reservas con fechas para visualización en el calendario.
 */
exports.getCalendarReservations = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT 
        BOOKING_ID,
        BOOKING_NAME,
        STATUS,
        START_TIME,
        END_TIME,
        EVENT_DATE
      FROM CLIENT_SCHEMA.BOOKINGS
      WHERE STATUS IN ('pendiente', 'en_progreso', 'completada', 'cancelada')`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

const formatted = result.rows.map(row => {
  const eventDate = row.EVENT_DATE;         // Fecha del evento
  const startTime = row.START_TIME;         // Hora de inicio
  const endTime = row.END_TIME;             // Hora de fin

  // Combina EVENT_DATE con las horas de START_TIME y END_TIME
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

  return {
    id: row.BOOKING_ID,
    name: row.BOOKING_NAME,
    status: row.STATUS.toLowerCase(),
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString()
  };
}).filter(e => e.start && e.end);



    
    console.log("Reservas formateadas para calendario:", formatted);
    res.json(formatted);
  } catch (err) {
    console.error("Error al obtener reservas para el calendario:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
