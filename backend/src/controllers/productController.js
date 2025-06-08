/**
 * @abstract Controlador responsable de gestionar las operaciones CRUD sobre productos.
 * Incluye funcionalidades para:
 * - Obtener productos (todos o por ID)
 * - Crear, actualizar y eliminar productos
 * 
 * @copyright BugBusters team 2025
 */

const { getConnection, oracledb } = require('../config/db');

/**
 * Obtiene todos los productos.
 */
exports.getAllProducts = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT PRODUCT_ID, NAME, UNITARY_PRICE, DESCRIPTION, TYPE FROM ADMIN_SCHEMA.PRODUCTS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const products = result.rows.map(p => ({
      id: p.PRODUCT_ID,
      name: p.NAME,
      price: p.UNITARY_PRICE,
      description: p.DESCRIPTION,
      type: p.TYPE
    }));

    res.json(products);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


/**
 * Obtiene un producto por su ID.
 */
exports.getProductById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT PRODUCT_ID, NAME, UNITARY_PRICE, DESCRIPTION, TYPE 
       FROM ADMIN_SCHEMA.PRODUCTS WHERE PRODUCT_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const product = result.rows[0];
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (err) {
    console.error('❌ Error al obtener producto:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Crea un nuevo producto.
 */
exports.createProduct = async (req, res) => {
  const { name, unitary_price, description, type } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO ADMIN_SCHEMA.PRODUCTS (PRODUCT_ID, NAME, UNITARY_PRICE, DESCRIPTION, TYPE)
      VALUES (ADMIN_SCHEMA.PRODUCT_ID_SEQ.NEXTVAL, :name, :unitary_price, :description, :type)
      RETURNING PRODUCT_ID INTO :product_id`,
      {
        name,
        unitary_price,
        description,
        type,
        product_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    res.status(201).json({ product_id: result.outBinds.product_id[0] });
  } catch (err) {
    console.error('❌ Error al crear producto:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Actualiza un producto existente.
 */
exports.updateProduct = async (req, res) => {
  const { name, unitary_price, description, type } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE ADMIN_SCHEMA.PRODUCTS SET 
        NAME = :name,
        UNITARY_PRICE = :unitary_price,
        DESCRIPTION = :description,
        TYPE = :type
      WHERE PRODUCT_ID = :id`,
      [name, unitary_price, description, type, req.params.id],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al actualizar producto:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Elimina un producto por su ID.
 */
exports.deleteProduct = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM ADMIN_SCHEMA.PRODUCTS WHERE PRODUCT_ID = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al eliminar producto:', err);
    if (conn) await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
