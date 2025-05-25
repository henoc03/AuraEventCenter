/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para las zonas
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todas las zonas, obtener una zona
 * por ID, crear, actualizar y eliminar zonas.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const { getConnection, oracledb } = require('../config/db');

const { encrypt, decrypt } = require('../utils/encryption');


/**
 * Obtiene todas las zonas disponibles.
 */
exports.getAllZones = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
  const result = await conn.execute(
    `SELECT ZONE_ID, NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE, IMAGE_PATH
    FROM ADMIN_SCHEMA.ZONES`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
const zones = result.rows.map(zone => {
  const decryptedPath = zone.IMAGE_PATH ? decrypt(zone.IMAGE_PATH) : null;

  return {
    ...zone,
    IMAGE_PATH: decryptedPath
  };
});

  

  res.json(zones)
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
  `SELECT ZONE_ID, NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE, IMAGE_PATH
   FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
  [req.params.id],
  { outFormat: oracledb.OUT_FORMAT_OBJECT }
);

const zone = result.rows[0];
if (zone) zone.IMAGE_PATH = zone.IMAGE_PATH ? decrypt(zone.IMAGE_PATH) : null;
res.json(zone || {});

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
  const { name, description, capacity, type, event_center_id, price, imagePath } = req.body;
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.ZONES (NAME, DESCRIPTION, CAPACITY, TYPE, EVENT_CENTER_ID, PRICE, IMAGE_PATH)
       VALUES (:name, :description, :capacity, :type, :event_center_id, :price, :image_path)
       RETURNING ZONE_ID INTO :zone_id`,
      {
        name,
        description,
        capacity,
        type,
        event_center_id,
        price,
        image_path: imagePath || null,
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
  const { name, description, capacity, type, event_center_id, price, imagePath } = req.body;
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
        PRICE = :price,
        IMAGE_PATH = :image_path
       WHERE ZONE_ID = :zone_id`,
      {
        name,
        description,
        capacity,
        type,
        event_center_id,
        price,
        image_path: imagePath || null,
        zone_id: req.params.id
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


exports.uploadZoneImage = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
      }
      const imagePath = `uploads/zones/${req.file.filename}`;
      const encryptedPath = encrypt(imagePath);
      res.status(200).json({ imagePath: encryptedPath });
    } catch (err) {
      console.error("❌ Error al subir imagen:", err);
      res.status(500).json({ error: err.message });
    }
  };
