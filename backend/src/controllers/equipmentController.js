/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para los equipos
 * dentro del esquema ADMIN_SCHEMA. Incluye manejo de imágenes con cifrado de rutas,
 * eliminación de imágenes físicas, y control de errores con rollback.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const fs = require('fs');
const path = require('path');

const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Elimina un archivo de imagen físicamente.
 * @param {string} imagePath Ruta relativa cifrada o descifrada de la imagen
 */
function deleteImageFile(imagePath) {
  if (!imagePath) return;
  // Si la ruta está cifrada, se asume que viene descifrada antes de llamar aquí.
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
 * Obtiene todos los equipos.
 */
exports.getAllEquipments = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ID, NAME, TYPE, DESCRIPTION, QUANTITY, IMAGE_PATH, UNITARY_PRICE FROM ADMIN_SCHEMA.EQUIPMENTS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const equipments = result.rows.map(e => ({
      ID: e.ID,
      name: e.NAME,
      type: e.TYPE,
      description: e.DESCRIPTION,
      quantity: e.QUANTITY,
      imagePath: e.IMAGE_PATH ? decrypt(e.IMAGE_PATH) : null,
      unitaryPrice: e.UNITARY_PRICE,
    }));


    res.json(equipments);
  } catch (err) {
    console.error("Error al obtener equipos:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene un equipo específico por ID.
 */
exports.getEquipmentById = async (req, res) => {
  let conn;
  try {
    const id = req.params.id;
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT ID, NAME, TYPE, DESCRIPTION, QUANTITY, IMAGE_PATH, UNITARY_PRICE FROM ADMIN_SCHEMA.EQUIPMENTS WHERE ID = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const equipment = result.rows[0];
    if (equipment) {
      equipment.IMAGE_PATH = equipment.IMAGE_PATH ? decrypt(equipment.IMAGE_PATH) : null;
    }

    res.json(equipment || {});
  } catch (err) {
    console.error("Error al obtener equipo:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Crea un nuevo equipo.
 */
exports.createEquipment = async (req, res) => {
  let conn;
  try {
    const { name, type, description, quantity, imagePath, unitaryPrice } = req.body;

    conn = await getConnection();

    const encryptedPath = imagePath;

    await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.EQUIPMENTS 
        (NAME, TYPE, DESCRIPTION, QUANTITY, IMAGE_PATH, UNITARY_PRICE)
      VALUES 
        (:name, :type, :description, :quantity, :imagePath, :unitaryPrice)`,
      {
        name,
        type,
        description,
        quantity,
        imagePath: encryptedPath,
        unitaryPrice,
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: "Equipo creado correctamente" });
  } catch (err) {
    console.error("Error al crear equipo:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


/**
 * Actualiza un equipo existente.
 */
exports.updateEquipment = async (req, res) => {
  let conn;
  try {
    const id = req.params.id;
    const { name, type, description, quantity, imagePath, unitaryPrice } = req.body;

    conn = await getConnection();

    // Obtener imagen previa para eliminar si se reemplaza
    let previousImagePath = null;
    if (imagePath) {
      const result = await conn.execute(
        `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.EQUIPMENTS WHERE ID = :id`,
        [id],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      previousImagePath = result.rows[0]?.IMAGE_PATH;
    }

    const encryptedPath = imagePath;

    await conn.execute(
      `UPDATE ADMIN_SCHEMA.EQUIPMENTS
      SET NAME = :name,
          TYPE = :type,
          DESCRIPTION = :description,
          QUANTITY = :quantity,
          IMAGE_PATH = :imagePath,
          UNITARY_PRICE = :unitaryPrice
      WHERE ID = :id`,
      {
        name,
        type,
        description,
        quantity,
        imagePath: encryptedPath,
        unitaryPrice,
        id,
      },
      { autoCommit: true }
    );

    // Eliminar imagen previa si fue reemplazada
    if (previousImagePath) {
      const decryptedPrevPath = decrypt(previousImagePath);
      deleteImageFile(decryptedPrevPath);
    }

    res.json({ message: "Equipo actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar equipo:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Elimina un equipo por su ID.
 */
exports.deleteEquipment = async (req, res) => {
  let conn;
  try {
    const id = req.params.id;

    conn = await getConnection();

    await conn.execute(
      `UPDATE ADMIN_SCHEMA.EQUIPMENTS SET ACTIVE = 0 WHERE ID = :id`,
      [id],
      { autoCommit: true }
    );

    res.sendStatus(204);
  } catch (err) {
    console.error("Error al eliminar equipo:", err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Endpoint para subir imagen y devolver ruta cifrada.
 */
exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No se proporcionó imagen" });

    const imagePath = `uploads/equipments/${file.filename}`;
    const encryptedPath = encrypt(imagePath);

    res.json({ imagePath: encryptedPath });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    res.status(500).json({ error: "Error interno al subir imagen" });
  }
};
