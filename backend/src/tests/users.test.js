const { encrypt, decrypt } = require('../utils/encryption');
const db = require('../config/db');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const mockFs = require('mock-fs');

jest.mock('../utils/encryption', () => ({
  encrypt: (text) => `encrypted_${text}`,
  decrypt: (text) => text.replace('encrypted_', ''),
}));

jest.mock('oracledb', () => ({
  OUT_FORMAT_OBJECT: 1,
  BIND_OUT: 3003,
  NUMBER: 2,
  getConnection: jest.fn(),
}));

jest.mock('../config/db', () => {
  return {
    getConnection: jest.fn(),
    oracledb: {
      OUT_FORMAT_OBJECT: 1,
      BIND_OUT: 2002,
      NUMBER: 'number',
    }
  };
});

jest.mock('../middleware/verifyToken', () => (req, res, next) => next());
jest.mock('../controllers/emailController', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(),
  sendRecoveryCode: jest.fn().mockResolvedValue(),
  verifyCode: jest.fn().mockResolvedValue(),
  resetPassword: jest.fn().mockResolvedValue(),
}));

const validToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'defaultSecret');
let userId;

describe('Users Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /users - debería devolver todos los usuarios', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { USER_ID: 1, EMAIL: 'test@mail.com', FIRST_NAME: 'Test', LAST_NAME_1: 'User', LAST_NAME_2: 'One', PHONE: '123', USER_TYPE: 'admin', ACTIVE: 1 },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { USER_ID: 1, EMAIL: 'test@mail.com', FIRST_NAME: 'Test', LAST_NAME_1: 'User', LAST_NAME_2: 'One', PHONE: '123', USER_TYPE: 'admin', ACTIVE: 1 },
    ]);
  });

  it('GET /users/:id - debería devolver un usuario por ID', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { USER_ID: 1, EMAIL: 'test@mail.com', FIRST_NAME: 'Test', LAST_NAME_1: 'User', LAST_NAME_2: 'One', PHONE: '123', USER_TYPE: 'admin', PROFILE_IMAGE_PATH: 'encrypted_path' },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ USER_ID: 1, EMAIL: 'test@mail.com', FIRST_NAME: 'Test', LAST_NAME_1: 'User', LAST_NAME_2: 'One', PHONE: '123', USER_TYPE: 'admin', PROFILE_IMAGE_PATH: 'path' });
  });

  it('GET /users/getNameEmail/:id - debería devolver nombre y correo', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { EMAIL: 'test@mail.com', FIRST_NAME: 'Test' },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/users/getNameEmail/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ EMAIL: 'test@mail.com', FIRST_NAME: 'Test' });
  });

  it('GET /users/getNameLastNameRole/:id - debería devolver nombre, apellido y rol', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { FIRST_NAME: 'Test', LAST_NAME_1: 'User', USER_TYPE: 'admin' },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/users/getNameLastNameRole/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ FIRST_NAME: 'Test', LAST_NAME_1: 'User', USER_TYPE: 'admin' });
  });

  it('POST /users - debería crear un usuario', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        outBinds: { user_id: [2] },
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .post('/users')
      .send({
        email: 'new@mail.com',
        first_name: 'New',
        last_name_1: 'User',
        last_name_2: 'Test',
        phone: '456',
        password: 'pass',
        user_type: 'client',
      })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ user_id: 2 });
    userId = res.body.user_id;
  });

  it('PUT /users/:id - debería actualizar un usuario', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({}),
      close: jest.fn(),
    });

    const res = await request(app)
      .put('/users/1')
      .send({
        email: 'updated@mail.com',
        first_name: 'Updated',
        last_name_1: 'User',
        last_name_2: 'Test',
        phone: '789',
        user_type: 'client',
      })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(204);
  });

  it('PUT /users/profile/:id - debería actualizar el perfil de usuario', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({}),
      close: jest.fn(),
    });

    const res = await request(app)
      .put('/users/profile/1')
      .field('firstName', 'Profile')
      .field('lastName1', 'User')
      .field('lastName2', 'Test')
      .field('email', 'profile@mail.com')
      .field('phone', '111')
      .attach('image', Buffer.from('fake image'), 'profile.jpg')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(204);
  });

  it('DELETE /users/:id - debería eliminar un usuario', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({}),
      close: jest.fn(),
    });

    const res = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(204);
  });

  it('POST /users/login - debería iniciar sesión correctamente', async () => {
    const bcrypt = require('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { USER_ID: 1, EMAIL: 'test@mail.com', PASSWORD: 'hashed', USER_TYPE: 'admin', FIRST_NAME: 'Test', LAST_NAME_1: 'User', LAST_NAME_2: 'One' },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .post('/users/login')
      .send({ email: 'test@mail.com', password: 'pass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /users/register - debería registrar un usuario', async () => {
    const bcrypt = require('bcrypt');
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('salt');
    jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn()
        .mockResolvedValueOnce({ rows: [] }) // check email
        .mockResolvedValueOnce({ outBinds: { user_id: [3] } }), // insert user
      close: jest.fn(),
    });

    const res = await request(app)
      .post('/users/register')
      .send({
        email: 'register@mail.com',
        first_name: 'Reg',
        last_name_1: 'User',
        last_name_2: 'Test',
        phone: '222',
        password: 'pass',
        user_type: 'client',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('token');
  });

  it('PUT /users/deactivate - debería desactivar un usuario', async () => {
    const bcrypt = require('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn()
        .mockResolvedValueOnce({ rows: [{ PASSWORD: 'hashed' }] })
        .mockResolvedValueOnce({}),
      close: jest.fn(),
    });

    const res = await request(app)
      .put('/users/deactivate')
      .send({ password: 'pass' })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Cuenta desactivada exitosamente.' });
  });

  it('GET /users - error de base de datos', async () => {
    db.getConnection.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
