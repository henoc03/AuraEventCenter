/**
 * @abstract Controlador responsable de gestionar las operaciones CRUD sobre usuarios,
 * así como la autenticación (login) y registro (register) de nuevos usuarios en el sistema.
 * Incluye funcionalidades para:
 * - Obtener usuarios (todos o por ID)
 * - Crear, actualizar y eliminar usuarios
 * - Validar credenciales y generar tokens JWT para autenticación
 * - Enviar correo de bienvenida al registrar un nuevo usuario
 * 
 * @copyright BugBusters team 2025, Universidad de Costa Rica
 */

const { getConnection, oracledb } = require('../config/db');
const { sendWelcomeEmail } = require('./emailController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'defaultSecret';
const bcrypt = require('bcrypt');
const { encrypt, decrypt } = require('../utils/encryption');
const path = require('path');
const fs = require('fs').promises;

exports.deactivateUser = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT PASSWORD FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id`,
      [userId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Soft delete: marcar usuario como inactivo
    await conn.execute(
      `UPDATE CLIENT_SCHEMA.USERS SET ACTIVE = 0 WHERE USER_ID = :id`,
      [userId],
      { autoCommit: true }
    );

    res.status(200).json({ message: 'Cuenta desactivada exitosamente.' });
  } catch (err) {
    console.error('❌ Error al desactivar cuenta:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

// Query para todos los usuarios
exports.getAllUsers = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, USER_TYPE , ACTIVE
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

/**
 * Obtiene un usuario por su ID.
 */
exports.getUserById = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, USER_TYPE, PROFILE_IMAGE_PATH 
       FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id AND ACTIVE = 1`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log(result);

    let user = result.rows[0] || {};
    if (user.PROFILE_IMAGE_PATH) {
      user.PROFILE_IMAGE_PATH = decrypt(user.PROFILE_IMAGE_PATH);
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene correo electrónico y nombre por ID de usuario.
 */
exports.getNameEmail = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT EMAIL, FIRST_NAME FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('❌ Error al obtener nombre y correo:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Obtiene nombre, primer apellido y rol por ID de usuario.
 */
exports.getNameLastnameRole = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT FIRST_NAME, LAST_NAME_1, USER_TYPE FROM CLIENT_SCHEMA.USERS WHERE USER_ID = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('❌ Error al obtener nombre y rol:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};

/**
 * Crea un nuevo usuario en la base de datos.
 */
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

/**
 * Actualiza los datos de un usuario existente.
 */
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
        USER_TYPE = :user_type
       WHERE USER_ID = :user_id`,
      [
        email,
        first_name,
        last_name_1,
        last_name_2,
        phone,
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

/**
 * Actualiza el perfil de un usuario.
 */
exports.updateProfile = async (req, res) => {
  const imageName = req.file ? req.file.filename : req.body.imageName || "";
  const {firstName, lastName1, lastName2, email, phone} = req.body;
  let conn;

  let imagePath = null;
  let encryptedPath = null;
  if (imageName != "") {
    imagePath = `uploads/users/${imageName}`;
    encryptedPath = encrypt(imagePath);
  }

  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE CLIENT_SCHEMA.USERS SET 
        FIRST_NAME = :firstName,
        LAST_NAME_1 = :lastName1,
        LAST_NAME_2 = :lastName2,
        EMAIL = :email,
        PHONE = :phone,
        PROFILE_IMAGE_NAME = :imageName,
        PROFILE_IMAGE_PATH = :encryptedPath
       WHERE USER_ID = :user_id`,
      [
        firstName,
        lastName1,
        lastName2,
        email,
        phone,
        imageName,
        encryptedPath,
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

/**
 * Elimina un usuario por su ID.
 */
exports.deleteUser = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE CLIENT_SCHEMA.USERS SET ACTIVE = 0 WHERE USER_ID = :id`,
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

/**
 * Valida credenciales y genera token JWT para iniciar sesión.
 */
// Query para validar datos de inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  let conn;

  try {
    conn = await getConnection();

    const result = await conn.execute(
      `SELECT * FROM CLIENT_SCHEMA.USERS WHERE EMAIL = :email AND ACTIVE = 1`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.PASSWORD);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        userId: user.USER_ID, // CAMBIO AQUÍ
        email: user.EMAIL,
        userType: user.USER_TYPE,
        firstName: user.FIRST_NAME,
        lastName1: user.LAST_NAME_1,
        lastName2: user.LAST_NAME_2
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


/**
 * Registra un nuevo usuario, valida si el correo ya existe,
 * crea el usuario, genera token JWT y envía correo de bienvenida.
 */
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario en la base de datos
    const result = await conn.execute(
      `INSERT INTO CLIENT_SCHEMA.USERS (USER_ID, EMAIL, FIRST_NAME, LAST_NAME_1, LAST_NAME_2, PHONE, PASSWORD, USER_TYPE)
       VALUES (CLIENT_SCHEMA.USER_ID_SEQ.NEXTVAL, :email, :first_name, :last_name_1, :last_name_2, :phone, :hashedPassword, :user_type)
       RETURNING USER_ID INTO :user_id`,
      {
        email,
        first_name,
        last_name_1,
        last_name_2,
        phone,
        hashedPassword,
        user_type,
        user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );

    const user_id = result.outBinds.user_id[0];

    // Generar token JWT para el usuario recién creado
    const token = jwt.sign(
      {
        userId: user_id, // CAMBIO AQUÍ
        email,
        userType: user_type,
        firstName: first_name,
        lastName1: last_name_1,
        lastName2: last_name_2
      },
      secretKey,
      { expiresIn: '2h' }
    );
    
    // Enviar correo de bienvenida
    await sendWelcomeEmail(email, `${first_name} ${last_name_1} ${last_name_2}`);

    res.status(201).json({ user_id, token });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
