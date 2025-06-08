/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para los servicios
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todos los servicios, obtener un servicio
 * por ID, crear, actualizar y eliminar servicios.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
*/

const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Obtiene todos los servicios disponibles.
*/
exports.getAllServices = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH
       FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Desencriptar el path de las imagenes del servicio
    const services = result.rows.map(service => {
      const decryptedPath = service.IMAGE_PATH ? decrypt(service.IMAGE_PATH) : null;

      return {
        ...service,
        IMAGE_PATH: decryptedPath
      };
    });

    res.json(services);
  } catch (err) {
    console.error('❌ Error al obtener los servicios:', err);
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
      `SELECT ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH
       FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const service = result.rows[0];
    if (service) service.IMAGE_PATH = service.IMAGE_PATH ? decrypt(service.IMAGE_PATH) : null;

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('❌ Error al obtener el servicio adicional:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene todas las imagenes de un servicio específico.
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
    if (mainImage) {
      mainImage = decrypt(mainImage);
    }

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