const { getConnection, oracledb } = require('../config/db');
const { sendWelcomeEmail } = require('./emailController');
const secretKey = process.env.JWT_SECRET || 'defaultSecret';
const jwt = require('jsonwebtoken');

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
      `INSERT INTO CLIENT_SCHEMA.USERS (USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, PASSWORD, USER_TYPE)
       VALUES (CLIENT_SCHEMA.USER_ID_SEQ.NEXTVAL, :email, :first_name, :last_name_1, :last_name_2, :phone, :password, :user_type)
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

// Query para validar datos de inicio de sesion
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT * FROM CLIENT_SCHEMA.USERS WHERE EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const user = result.rows[0];

    if (!user || user.PASSWORD !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: user.USER_ID,
        email: user.EMAIL,
        userType: user.USER_TYPE,
        firstName: user.FIRST_NAME,
        lastName1: user.LAST_NAME_1
      },
      secretKey, 
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Query para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { email, first_name, last_name_1, last_name_2, phone, password, user_type } = req.body;
  let conn;
  
  try {
    conn = await getConnection();

    // Verificar si el email ya está registrado
    const checkEmailResult = await conn.execute(
      `SELECT 1 FROM CLIENT_SCHEMA.USERS WHERE EMAIL = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Crear el usuario en la base de datos
    const result = await conn.execute(
      `INSERT INTO CLIENT_SCHEMA.USERS (USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, PASSWORD, USER_TYPE)
       VALUES (CLIENT_SCHEMA.USER_ID_SEQ.NEXTVAL, :email, :first_name, :last_name_1, :last_name_2, :phone, :password, :user_type)
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

    const user_id = result.outBinds.user_id[0];

    const token = jwt.sign(
      { id: user_id, email: email },
      secretKey,
      { expiresIn: '2h' }
    );

    await sendWelcomeEmail(email, `${first_name} ${last_name_1} ${last_name_2}`);

    res.status(201).json({ user_id, token });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
