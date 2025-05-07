const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

// ===================== ZONES =====================

exports.getAllZones = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ZONE_ID, NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE, ACTIVE
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

exports.updateZone = async (req, res) => {
  const { name, type, price, capacity, description, event_center_id } = req.body;
  console.log(req.body)
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE ADMIN_SCHEMA.ZONES SET 
        NAME = :name,
        DESCRIPTION = :description,
        CAPACITY = :capacity,
        "TYPE" = :type,
        EVENT_CENTER_ID = :event_center_id,
        PRICE = :price
       WHERE ZONE_ID = :zone_id`,
      {
        name,
        description,
        capacity,
        type,
        event_center_id,
        price,
        zone_id: Number(req.params.id)
      },
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

exports.getAllImages = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT IMAGE_ID, ZONE_ID, IMAGE_ADDRESS, IMAGE_NAME FROM ADMIN_SCHEMA.IMAGES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const images = result.rows.map(img => ({
      ...img,
      IMAGE_NAME: decrypt(img.IMAGE_NAME)
    }));

    res.json(images);
  } catch (err) {
    console.error('❌ Error al obtener imágenes:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

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

    const images = result.rows.map(img => ({
      ...img,
      IMAGE_NAME: decrypt(img.IMAGE_NAME)
    }));

    res.json(images);
  } catch (err) {
    console.error('❌ Error al obtener imágenes por zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.createImage = async (req, res) => {
  const { image_address, image_name } = req.body;
  const zone_id = req.params.zone_id;
  let conn;
  try {
    const encryptedName = encrypt(image_name);

    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.IMAGES (ZONE_ID, IMAGE_ADDRESS, IMAGE_NAME)
       VALUES (:zone_id, :image_address, :image_name)
       RETURNING IMAGE_ID INTO :image_id`,
      {
        zone_id,
        image_address,
        image_name: encryptedName,
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

exports.updateImage = async (req, res) => {
  const { image_address, image_name } = req.body;
  let conn;
  try {
    const encryptedName = encrypt(image_name);

    conn = await getConnection();
    await conn.execute(
      `UPDATE ADMIN_SCHEMA.IMAGES SET 
        IMAGE_ADDRESS = :image_address,
        IMAGE_NAME = :image_name
       WHERE IMAGE_ID = :image_id`,
      {
        image_address,
        image_name: encryptedName,
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
