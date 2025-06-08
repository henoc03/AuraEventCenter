/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para las zonas
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todas las zonas, obtener una zona
 * por ID, crear, actualizar y eliminar zonas.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const { getConnection, oracledb } = require('../config/db');
const path = require('path');
const fs = require('fs').promises;
const { encrypt, decrypt } = require('../utils/encryption');


const deletedFiles = new Set();

async function deletePhysicalFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (deletedFiles.has(fullPath)) return;

  try {
    await fs.unlink(fullPath);
    deletedFiles.add(fullPath);
  } catch (err) {
    console.error(`❌ No se pudo borrar el archivo: ${fullPath}`, err.message);
  }
}

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
    console.error('Error al crear zona:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.updateZone = async (req, res) => {
  const { name, description, capacity, type, event_center_id, price, imagePath } = req.body;
  const zoneId = req.params.id;
  let conn;

  try {
    conn = await getConnection();

    let finalImagePath = imagePath;
    if (imagePath === null || imagePath === undefined) {
      const result = await conn.execute(
        `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
        [zoneId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      finalImagePath = result.rows[0]?.IMAGE_PATH || null;
    }

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
        image_path: finalImagePath,
        zone_id: zoneId
      },
      { autoCommit: true }
    );

    res.status(200).json({ message: 'Zona actualizada correctamente' });

  } catch (err) {
  console.error('❌ Error al actualizar zona:', err);
  res.status(500).json({ message: 'Error al actualizar la zona: ' + err.message });
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
    const zoneId = req.params.id;

    // 1. Obtener las rutas de imágenes secundarias (para eliminar los archivos)
    const secImages = await conn.execute(
      `SELECT i.IMAGE_ADDRESS, i.IMAGE_ID
       FROM ADMIN_SCHEMA.IMAGES i
       JOIN ADMIN_SCHEMA.ZONE_IMAGES zi ON zi.IMAGE_ID = i.IMAGE_ID
       WHERE zi.ZONE_ID = :id`,
      [zoneId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // 2. Obtener imagen principal (IMAGE_PATH)
    const mainImageResult = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
      [zoneId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const mainImagePathEncrypted = mainImageResult.rows[0]?.IMAGE_PATH;
    const mainImagePath = mainImagePathEncrypted ? decrypt(mainImagePathEncrypted) : null;

    // 3. Construir lista de rutas de imágenes físicas a eliminar
    const imagePathsSet = new Set();
    const imageIds = [];

    if (mainImagePath) imagePathsSet.add(mainImagePath);
    secImages.rows.forEach(img => {
      imagePathsSet.add(decrypt(img.IMAGE_ADDRESS));
      imageIds.push(img.IMAGE_ID);
    });

    // 4. Eliminar archivos físicos
    await Promise.allSettled(
      Array.from(imagePathsSet).map(deletePhysicalFile)
    );

    // 5. Eliminar datos relacionados respetando el orden correcto
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.ZONE_EQUIPMENTS WHERE ZONE_ID = :id`, [zoneId], { autoCommit: false });
    await conn.execute(`DELETE FROM RELATIONS_SCHEMA.BOOKINGS_ZONES WHERE ZONE_ID = :id`, [zoneId], { autoCommit: false });
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.ZONE_IMAGES WHERE ZONE_ID = :id`, [zoneId], { autoCommit: false });

    // 6. Eliminar imágenes si hay
    if (imageIds.length > 0) {
      const placeholders = imageIds.map((_, i) => `:${i + 1}`).join(', ');
      await conn.execute(
        `DELETE FROM ADMIN_SCHEMA.IMAGES WHERE IMAGE_ID IN (${placeholders})`,
        imageIds,
        { autoCommit: false }
      );
    }

    // 7. Finalmente eliminar la zona
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`, [zoneId], { autoCommit: false });

    // 8. Confirmar todos los cambios
    await conn.commit();

    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar zona:', err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};




exports.uploadZonePrimaryImage = (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
      }
      const imagePath = `uploads/zones/${req.file.filename}`;
      const encryptedPath = encrypt(imagePath);
      res.status(200).json({ imagePath: encryptedPath });
    } catch (err) {
      console.error("Error al subir imagen:", err);
      res.status(500).json({ error: err.message });
    }
  };


exports.uploadZoneSecondaryImage = async (req, res) => {
  let conn;
  try {
    const { zoneId } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: "No se recibió ninguna imagen." });
    }

  const imagePath = `uploads/zones/${image.filename}`;
  const encryptedPath = encrypt(imagePath);
  const imageName = image.originalname;

  conn = await getConnection();

  const result = await conn.execute(
    `INSERT INTO ADMIN_SCHEMA.IMAGES (IMAGE_ADDRESS, IMAGE_NAME)
    VALUES (:imageAddress, :imageName)
    RETURNING IMAGE_ID INTO :imageId`,
    {
      imageAddress: encryptedPath,
      imageName,
      imageId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    },
    { autoCommit: false }
  );

  const imageId = result.outBinds.imageId[0];

  await conn.execute(
    `INSERT INTO ADMIN_SCHEMA.ZONE_IMAGES (ZONE_ID, IMAGE_ID)
    VALUES (:zoneId, :imageId)`,
    { zoneId, imageId },
    { autoCommit: true }
  );

  res.status(200).json({ message: "Imagen secundaria subida con éxito.", imageId, imagePath: encryptedPath });

    } catch (error) {
      console.error("Error al subir imagen secundaria:", error);
      res.status(500).json({ message: "Error al subir imagen secundaria." });
    } finally {
      if (conn) await conn.close();
    }
};


exports.getAllZoneImages = async (req, res) => {
  let conn;
  try {
    const zoneId = req.params.zoneId;
    conn = await getConnection();

    const zoneResult = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :zoneId`,
      [zoneId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let mainImage = zoneResult.rows[0]?.IMAGE_PATH || null;
    if (mainImage) {
      mainImage = decrypt(mainImage);
    }

    const imagesResult = await conn.execute(
      `SELECT i.IMAGE_ID, i.IMAGE_ADDRESS
       FROM ADMIN_SCHEMA.IMAGES i
       JOIN ADMIN_SCHEMA.ZONE_IMAGES zi ON zi.IMAGE_ID = i.IMAGE_ID
       WHERE zi.ZONE_ID = :zoneId`,
      [zoneId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const secondaryImages = imagesResult.rows.map(img => ({
      id: img.IMAGE_ID,
      path: decrypt(img.IMAGE_ADDRESS)
    }));

    const allImages = [];

    if (mainImage) {
      allImages.push({ id: 'main', path: mainImage });
    }

    allImages.push(...secondaryImages);

    res.json(allImages);
  } catch (err) {
    console.error("Error al obtener todas las imágenes:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.deleteZonePrimaryImage = async (req, res) => {
  let conn;
  try {
    const zoneId = req.params.id;

    conn = await getConnection();

    // Obtener la ruta
    const result = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID = :id`,
      [zoneId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const encryptedPath = result.rows[0]?.IMAGE_PATH;
    if (!encryptedPath) {
      return res.status(404).json({ error: "No hay imagen principal para eliminar." });
    }

    const decryptedPath = decrypt(encryptedPath);

    // Eliminar archivo físico
    await deletePhysicalFile(decryptedPath);

    // Actualizar campo IMAGE_PATH a null
    await conn.execute(
      `UPDATE ADMIN_SCHEMA.ZONES SET IMAGE_PATH = NULL WHERE ZONE_ID = :id`,
      [zoneId],
      { autoCommit: true }
    );

    res.status(200).json({ message: "Imagen principal eliminada correctamente" });

  } catch (error) {
    console.error("❌ Error al eliminar imagen principal:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) await conn.close();
  }
};

exports.deleteZoneSecondaryImage = async (req, res) => {
  let conn;
  try {
     const imageId = req.params.imageId;

    conn = await getConnection();

    // Obtener la ruta de la imagen
    const result = await conn.execute(
      `SELECT IMAGE_ADDRESS FROM ADMIN_SCHEMA.IMAGES WHERE IMAGE_ID = :id`,
      [imageId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }

    const encryptedPath = result.rows[0].IMAGE_ADDRESS;
    const decryptedPath = decrypt(encryptedPath);

    // Eliminar archivo físico
    await deletePhysicalFile(decryptedPath);

    // Eliminar relaciones y la imagen
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.ZONE_IMAGES WHERE IMAGE_ID = :id`, [imageId], { autoCommit: false });
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.IMAGES WHERE IMAGE_ID = :id`, [imageId], { autoCommit: true });

    res.status(200).json({ message: 'Imagen secundaria eliminada correctamente' });

  } catch (error) {
    console.error("❌ Error al eliminar imagen secundaria:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) await conn.close();
  }
};
