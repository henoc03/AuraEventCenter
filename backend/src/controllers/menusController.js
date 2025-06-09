/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para los menús
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todos los menús, obtener un menú
 * por ID, crear, actualizar y eliminar menús.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
*/

const { getConnection, oracledb } = require('../config/db');
const path = require('path');
const fs = require('fs').promises;
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Obtiene todos los menús disponibles.
*/
exports.getAllMenus = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    // Obtener todos los menús
    const menusResult = await conn.execute(
      `SELECT MENU_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH, AVAILABLE, TYPE
       FROM ADMIN_SCHEMA.CATERING_MENUS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Agregar path de la imagen y array de productos al menú
    const menus = menusResult.rows.map(menu => ({
      ...menu,
      IMAGE_PATH: menu.IMAGE_PATH ? decrypt(menu.IMAGE_PATH) : null,
      PRODUCTS: []
    }));

    // Obtener todos los productos relacionados a los menús
    let productsResult = { rows: [] };
    productsResult = await conn.execute(
      `SELECT mp.MENU_ID, mp.PRODUCT_ID, p.NAME, p.DESCRIPTION, p.UNITARY_PRICE
        FROM ADMIN_SCHEMA.CATERING_MENUS m
        JOIN ADMIN_SCHEMA.PRODUCTS_MENUS mp ON m.MENU_ID = mp.MENU_ID
        JOIN ADMIN_SCHEMA.PRODUCTS p ON mp.PRODUCT_ID = p.PRODUCT_ID`,
        [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Agrupar productos por menú
    const productsByMenu = {};
    menusResult.rows.forEach(menu => {
      productsByMenu[menu.MENU_ID] = productsResult.rows
        .filter(product => product.MENU_ID === menu.MENU_ID)
        .map(product => ({
          PRODUCT_ID: product.PRODUCT_ID,
          NAME: product.NAME,
          DESCRIPTION: product.DESCRIPTION,
          UNITARY_PRICE: product.UNITARY_PRICE
        }));
    });

    // Asignar productos a cada menú
    menus.forEach(menu => {
      menu.PRODUCTS = productsByMenu[menu.MENU_ID] || [];
    });

    menus.forEach(menu => {
      menu.PRICE = menu.PRODUCTS.reduce((sum, product) => sum + (product.UNITARY_PRICE || 0), 0);
    });

    res.json(menus);
  } catch (err) {
    console.error('❌ Error al obtener los menús:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene un menú específico por su ID.
 */
exports.getMenuById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT MENU_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH, ACTIVE
       FROM ADMIN_SCHEMA.CATERING_MENUS WHERE MENU_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const menu = result.rows[0];
    if (menu) menu.IMAGE_PATH = menu.IMAGE_PATH ? decrypt(menu.IMAGE_PATH) : null;

    res.json(menu || {});
  } catch (err) {
    console.error('❌ Error al obtener el menú:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Sube una imagen principal para un menú.
 */
exports.uploadMenuPrimaryImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

    const imagePath = `uploads/menus/${req.file.filename}`;
    const encryptedPath = encrypt(imagePath);

    res.status(200).json({ imagePath: encryptedPath });
  } catch (err) {
    console.error("Error al subir imagen:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenuPrimaryImage = async (req, res) => {
  let conn;
  try {
    const menuId = req.params.id;

    conn = await getConnection();

    // Obtener la ruta
    const result = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.CATERING_MENUS WHERE MENU_ID = :id`,
      [menuId],
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
      `UPDATE ADMIN_SCHEMA.CATERING_MENUS SET IMAGE_PATH = NULL WHERE MENU_ID = :id`,
      [menuId],
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
 * Obtiene todas las imagenes de un menú específico.
 */
exports.getAllMenuImages = async (req, res) => {
  let conn;
  try {
    const menuId = req.params.menuId;
    conn = await getConnection();

    const menuResult = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.CATERING_MENUS 
      WHERE MENU_ID = :menuId`,
      [menuId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    let mainImage = menuResult.rows[0]?.IMAGE_PATH || null;
    if (mainImage) {
      mainImage = decrypt(mainImage);
    }

    const imagesResult = await conn.execute(
      `SELECT i.IMAGE_ID, i.IMAGE_ADDRESS
       FROM ADMIN_SCHEMA.IMAGES i
       JOIN ADMIN_SCHEMA.CATERING_IMAGES zi ON zi.IMAGE_ID = i.IMAGE_ID
       WHERE zi.MENU_ID = :menuId`,
      [menuId],
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

/** 
 * Crea un nuevo menú.
*/
console.log("✅ createMenu endpoint alcanzado");
exports.createMenu = async (req, res) => {
  let conn;
  try {
    const {
      name,
      description,
      type,
      available,
      imagePath,
      products
    } = req.body;

    let price = 0;
    if (Array.isArray(products) && products.length > 0) {
      try {
        conn = await getConnection();
        // Traer los productos de la base de datos cuyos IDs estén en products
        const placeholders = products.map((_, i) => `:id${i}`).join(',');
        const binds = {};
        products.forEach((id, i) => { binds[`id${i}`] = id; });

        const result = await conn.execute(
          `SELECT PRODUCT_ID, UNITARY_PRICE FROM ADMIN_SCHEMA.PRODUCTS WHERE PRODUCT_ID IN (${placeholders})`,
          binds,
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        // Sumar los precios de los productos encontrados
        price = result.rows.reduce((sum, prod) => sum + (Number(prod.UNITARY_PRICE) || 0), 0);
      } catch (err) {
        console.error('❌ Error al calcular el precio de los productos:', err);
        price = 0;
      }
    }

    conn = await getConnection();

    // Insertar menú
    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.CATERING_MENUS
        (NAME, DESCRIPTION, TYPE, PRICE, IMAGE_PATH, AVAILABLE, ADDITIONAL_SERVICE_ID)
       VALUES (:name, :description, :type, :price, :imagePath, :available, :serviceId)
       RETURNING MENU_ID INTO :menuId`,
      {
        name,
        description,
        type,
        price,
        imagePath: imagePath || null,
        available: available,
        serviceId: 1,
        menuId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: false }
    );

    const menuId = result.outBinds.menuId[0];

    // Insertar productos asociados
    for (const productId of products) {
      await conn.execute(
        `INSERT INTO ADMIN_SCHEMA.PRODUCTS_MENUS (MENU_ID, PRODUCT_ID)
         VALUES (:menuId, :productId)`,
        { menuId, productId },
        { autoCommit: false }
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Menú creado", menu_id: menuId });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("❌ Error al crear menú:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Actualizar un menú
 */
exports.updateMenu = async (req, res) => {
  const { name, description, type, available, products, imagePath } = req.body;
  const menuId = req.params.id;
  let conn;

  let price = 0;
  if (Array.isArray(products) && products.length > 0) {
    try {
      conn = await getConnection();
      // Traer los productos de la base de datos cuyos IDs estén en products
      const placeholders = products.map((_, i) => `:id${i}`).join(',');
      const binds = {};
      products.forEach((id, i) => { binds[`id${i}`] = id; });

      const result = await conn.execute(
        `SELECT PRODUCT_ID, UNITARY_PRICE FROM ADMIN_SCHEMA.PRODUCTS WHERE PRODUCT_ID IN (${placeholders})`,
        binds,
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      // Sumar los precios de los productos encontrados
      price = result.rows.reduce((sum, prod) => sum + (Number(prod.UNITARY_PRICE) || 0), 0);
    } catch (err) {
      console.error('❌ Error al calcular el precio de los productos:', err);
      price = 0;
    }
  }

  try {
    conn = await getConnection();

    await conn.execute(
      `UPDATE ADMIN_SCHEMA.CATERING_MENUS SET 
        NAME = :name,
        DESCRIPTION = :description,
        TYPE = :type,
        PRICE = :price,
        AVAILABLE = :available,
        IMAGE_PATH = :imagePath
       WHERE MENU_ID = :menuId`,
      {
        name,
        description,
        type,
        price,
        available,
        imagePath,
        menuId: menuId
      },
      { autoCommit: true }
    );

    // Antes del for que inserta los productos:
    await conn.execute(
      `DELETE FROM ADMIN_SCHEMA.PRODUCTS_MENUS WHERE MENU_ID = :menuId`,
      { menuId },
      { autoCommit: true }
    );

    // Insertar los nuevos productos asociados al menú
    for (const productId of products) {
      await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.PRODUCTS_MENUS (MENU_ID, PRODUCT_ID) VALUES (:menuId, :productId)`,
      { menuId, productId },
      { autoCommit: true }
      );
    }

    res.status(200).json({ message: 'Menu actualizado correctamente' });
  } catch (err) {
  console.error('❌ Error al actualizar el menú:', err);
  res.status(500).json({ message: 'Error al actualizar el menú: ' + err.message });
} finally {
    if (conn) await conn.close();
  }
};

/**
 * Elimina un menú identificada por su ID.
 */
exports.deleteMenu = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const menuId = req.params.id;

    // Obtener imagen principal (IMAGE_PATH)
    const mainImageResult = await conn.execute(
      `SELECT IMAGE_PATH FROM ADMIN_SCHEMA.CATERING_MENUS WHERE MENU_ID = :id`,
      [menuId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const mainImagePathEncrypted = mainImageResult.rows[0]?.IMAGE_PATH;
    const mainImagePath = mainImagePathEncrypted ? decrypt(mainImagePathEncrypted) : null;

    // Eliminar archivo físico
    if(mainImagePath != null ) await deletePhysicalFile(mainImagePath);

    // Eliminar datos relacionados respetando el orden correcto
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.PRODUCTS_MENUS WHERE MENU_ID = :id`, [menuId], { autoCommit: false });
    await conn.execute(`DELETE FROM ADMIN_SCHEMA.CATERING_MENUS WHERE MENU_ID = :id`, [menuId], { autoCommit: false });
    await conn.commit();

    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar el menú:', err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};