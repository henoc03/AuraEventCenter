/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para los servicios
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todos los servicios, obtener un servicio
 * por ID, crear, actualizar y eliminar servicios.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
*/

const { getConnection, oracledb } = require('../config/db');

/**
 * Obtiene todos los servicios disponibles.
*/
exports.getAllServices = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE
       FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
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
      `SELECT ADDITIONAL_SERVICE_ID, NAME, DESCRIPTION, PRICE
       FROM ADMIN_SCHEMA.ADDITIONAL_SERVICES WHERE ADDITIONAL_SERVICE_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('❌ Error al obtener el servicio adicional:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};