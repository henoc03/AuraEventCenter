/**
 * @abstract Controlador encargado de gestionar las operaciones CRUD para los menús
 * dentro del esquema ADMIN_SCHEMA. Permite obtener todos los menús, obtener un menú
 * por ID, crear, actualizar y eliminar menús.
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
*/

const { getConnection, oracledb } = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * Obtiene todos los menús disponibles.
*/
exports.getAllMenus = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT MENU_ID, NAME, DESCRIPTION, PRICE, IMAGE_PATH, AVAILABLE
       FROM ADMIN_SCHEMA.CATERING_MENUS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Desencriptar el path de las imagenes del menú
    const menus = result.rows.map(menu => {
      const decryptedPath = menu.IMAGE_PATH ? decrypt(menu.IMAGE_PATH) : null;

      // TODO: Traer los productos de cada menu
      return {
        ...menu,
        IMAGE_PATH: decryptedPath
      };
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
       JOIN ADMIN_SCHEMA.MENU_IMAGES zi ON zi.IMAGE_ID = i.IMAGE_ID
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