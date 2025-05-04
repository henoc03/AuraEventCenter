const { getConnection, oracledb } = require('../config/db');

// Query para todos los usuarios
exports.getAllUsers = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, USER_TYPE 
       FROM CLIENT_SCHEMA.USERS`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Query para usuario por ID
exports.getUserById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, USER_TYPE 
       FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Query para crear usuario
exports.createUser = async (req, res) => {
  const { email, first_name, last_name_1, last_name_2, phone, password, user_type } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO CLIENT_SCHEMA.USERS (EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, PASSWORD, USER_TYPE)
       VALUES (:email, :first_name, :last_name_1, :last_name_2, :phone, :password, :user_type)
       RETURNING USER_ID INTO :user_id`,
      {
        email,
        first_name,
        last_name_1,
        last_name_2,
        phone,
        password,
        user_type,
        user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    res.status(201).json({ user_id: result.outBinds.user_id[0] });
  } catch (err) {
    console.error('❌ Error al crear usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Query para actualizar usuario
exports.updateUser = async (req, res) => {
  const { email, first_name, last_name_1, last_name_2, phone, password, user_type } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE CLIENT_SCHEMA.USERS SET 
        EMAIL = :email,
        FIRST_NAME = :first_name,
        LAST_NAME_1 = :last_name_1,
        LAST_NAME_2 = :last_name_2,
        PHONE = :phone,
        PASSWORD = :password,
        USER_TYPE = :user_type
       WHERE USER_ID = :user_id`,
      [
        email,
        first_name,
        last_name_1,
        last_name_2,
        phone,
        password,
        user_type,
        req.params.id
      ],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Query para eliminar usuario
exports.deleteUser = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `DELETE FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
