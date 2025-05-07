const { getConnection, oracledb } = require('../config/db');

// ===================== ZONES =====================

// Obtener todas las zonas
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

// Obtener zona por ID
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

// Crear zona
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

// Actualizar zona
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

// Eliminar zona
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

// ===================== IMAGES =====================

// Obtener todas las imágenes
exports.getAllImages = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT IMAGE_ID, ZONE_ID, IMAGE_ADDRESS, IMAGE_NAME FROM ADMIN_SCHEMA.IMAGES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener imágenes:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Obtener imágenes por ZONE_ID
exports.getImagesByZoneId = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT IMAGE_ID, ZONE_ID, IMAGE_ADDRESS, IMAGE_NAME
       FROM ADMIN_SCHEMA.IMAGES WHERE ZONE_ID = :zone_id`,
      [req.params.zone_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener imágenes por zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Crear imagen asociada a zona
exports.createImage = async (req, res) => {
  const { image_address, image_name } = req.body;
  const zone_id = req.params.zone_id;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.IMAGES (ZONE_ID, IMAGE_ADDRESS, IMAGE_NAME)
       VALUES (:zone_id, :image_address, :image_name)
       RETURNING IMAGE_ID INTO :image_id`,
      {
        zone_id,
        image_address,
        image_name,
        image_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    res.status(201).json({ image_id: result.outBinds.image_id[0] });
  } catch (err) {
    console.error('❌ Error al crear imagen:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Actualizar imagen
exports.updateImage = async (req, res) => {
  const { image_address, image_name } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE ADMIN_SCHEMA.IMAGES SET 
        IMAGE_ADDRESS = :image_address,
        IMAGE_NAME = :image_name
       WHERE IMAGE_ID = :image_id`,
      {
        image_address,
        image_name,
        image_id: req.params.image_id
      },
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al actualizar imagen:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Eliminar imagen
exports.deleteImage = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM ADMIN_SCHEMA.IMAGES WHERE IMAGE_ID = :image_id`,
      [req.params.image_id],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al eliminar imagen:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
