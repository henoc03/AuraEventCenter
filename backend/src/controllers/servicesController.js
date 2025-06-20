/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para los servicios
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todos los servicios, obtener un servicio
 * por ID, crear, actualizar y eliminar servicios.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const fs = require('fs');
const path = require('path');

const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

function deleteImageFile(imagePath) {
  const absolutePath = path.join(__dirname, '..', imagePath);
  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error("Error al eliminar la imagen:", err.message);
    } else {
      console.log("Imagen eliminada correctamente:", imagePath);
    }
  });
}


/**
 * Obtiene todos los servicios disponibles.
 */
exports.getAllServices = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH, ACTIVE
       FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const services = result.rows.map(service => {
      const decryptedPath = service.IMAGE_PATH ? decrypt(service.IMAGE_PATH) : null;
      return {
        ID: service.ADDITIONAL_SERVICE_ID,
        name: service.NAME,
        description: service.DESCRIPTION,
        price: service.PRICE,
        imagePath: decryptedPath,
        active: service.ACTIVE,
      };
    });

    res.json(services);
  } catch (err) {
    console.error('Error al obtener los servicios:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene un servicio específico por su ID.
 */
exports.getServiceById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH, ACTIVE
       FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const service = result.rows[0];
    if (service) {
      service.IMAGE_PATH = service.IMAGE_PATH ? decrypt(service.IMAGE_PATH) : null;
    }

    res.json(service || {});
  } catch (err) {
    console.error('Error al obtener el servicio adicional:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todas las imágenes de un servicio específico.
 */
exports.getAllServiceImages = async (req, res) => {
  let conn;
  try {
    const serviceId = req.params.serviceId;
    conn = await getConnection();

    const serviceResult = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES 
       WHERE ADDITIONAL_SERVICE_ID = :serviceId`,
      [serviceId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let mainImage = serviceResult.rows[0]?.IMAGE_PATH || null;
    if (mainImage) mainImage = decrypt(mainImage);

    const imagesResult = await conn.execute(
      `SELECT i.IMAGE_ID, i.IMAGE_ADDRESS
       FROM ADMIN_SCHEMA.IMAGES i
       JOIN ADMIN_SCHEMA.SERVICE_IMAGES zi ON zi.IMAGE_ID = i.IMAGE_ID
       WHERE zi.ADDITIONAL_SERVICE_ID = :serviceId`,
      [serviceId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const secondaryImages = imagesResult.rows.map(img => ({
      id: img.IMAGE_ID,
      path: decrypt(img.IMAGE_ADDRESS)
    }));

    const allImages = [];
    if (mainImage) allImages.push({ id: 'main', path: mainImage });
    allImages.push(...secondaryImages);

    res.json(allImages);
  } catch (err) {
    console.error("Error al obtener todas las imágenes:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Crea un nuevo servicio.
 */
exports.createService = async (req, res) => {
  const { name, description, price, imagePath, active } = req.body;
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.ADDITIONAL_SERVICES 
        (ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH, ACTIVE)
       VALUES 
        (ADMIN_SCHEMA.ISEQ$$_105314.NEXTVAL, :name, :description, :price, :imagePath, :active)
       RETURNING ADDITIONAL_SERVICE_ID INTO :service_id`,
      {
        name,
        description,
        price,
        imagePath: imagePath || null,
        active,
        service_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({ service_id: result.outBinds.service_id[0] });
  } catch (err) {
    console.error('Error al crear servicio:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Actualiza un servicio existente sin sobreescribir la imagen si no se proporciona una nueva.
 */
exports.updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imagePath, active } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const currentEncryptedImagePath = result.rows[0]?.IMAGE_PATH;


    const encryptedPath = imagePath ? imagePath : currentEncryptedImagePath;

    await conn.execute(
      `UPDATE ADMIN_SCHEMA.ADDITIONAL_SERVICES
       SET NAME = :name,
           DESCRIPTION = :description,
           PRICE = :price,
           IMAGE_PATH = :imagePath,
           ACTIVE = :active
       WHERE ADDITIONAL_SERVICE_ID = :id`,
      {
        name,
        description,
        price,
        imagePath: encryptedPath,
        active,
        id
      },
      { autoCommit: true }
    );

    if (previousImagePath) {
      const decryptedPath = decrypt(previousImagePath);
      deleteImageFile(decryptedPath);
    }

    res.status(200).json({ message: "Servicio actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar el servicio:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};



/**
 * Elimina un servicio por su ID.
 */
exports.deleteService = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const encryptedPath = result.rows[0]?.IMAGE_PATH;
    const decryptedPath = encryptedPath ? decrypt(encryptedPath) : null;

    await conn.execute(
      `DELETE FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID = :id`,
      [req.params.id],
      { autoCommit: true }
    );

    if (decryptedPath) {
      deleteImageFile(decryptedPath);
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar servicio:', err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No se proporcionó imagen" });

    const imagePath = `uploads/services/${file.filename}`;

    const encryptedPath = encrypt(imagePath);

    res.json({ imagePath: encryptedPath });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    res.status(500).json({ error: "Error interno al subir imagen" });
  }
};

