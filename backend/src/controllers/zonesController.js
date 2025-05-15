/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para las zonas
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todas las zonas, obtener una zona
 * por ID, crear, actualizar y eliminar zonas.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const { getConnection, oracledb } = require('../config/db');

/**
 * Obtiene todas las zonas disponibles.
 */
exports.getAllZones = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ZONE_ID, NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE
       FROM ADMIN_SCHEMA.ZONES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener zonas:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene una zona específica por su ID.
 */
exports.getZoneById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ZONE_ID, NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE
       FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('❌ Error al obtener zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Crea una nueva zona con los datos proporcionados en el body.
 */
exports.createZone = async (req, res) => {
  const { name, description, capacity, type, event_center_id, price } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.ZONES (NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE)
       VALUES (:name, :description, :capacity, :type, :event_center_id, :price)
       RETURNING ZONE_ID INTO :zone_id`,
      {
        name,
        description,
        capacity,
        type,
        event_center_id,
        price,
        zone_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    res.status(201).json({ zone_id: result.outBinds.zone_id[0] });
  } catch (err) {
    console.error('❌ Error al crear zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Actualiza una zona existente identificada por su ID con los datos proporcionados.
 */
exports.updateZone = async (req, res) => {
  const { name, description, capacity, type, event_center_id, price } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE ADMIN_SCHEMA.ZONES SET 
        NAME = :name,
        DESCRIPTION = :description,
        CAPACITY = :capacity,
        TYPE = :type,
        EVENT_CENTER_ID = :event_center_id,
        PRICE = :price
       WHERE ZONE_ID = :zone_id`,
      [
        name,
        description,
        capacity,
        type,
        event_center_id,
        price,
        req.params.id
      ],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al actualizar zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Elimina una zona identificada por su ID.
 */
exports.deleteZone = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al eliminar zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
