const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

const { encrypt, decrypt } = require('../utils/encryption');
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
    getConnection: jest.fn(() => ({
      execute: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      close: jest.fn(),
    })),
    oracledb: {
      OUT_FORMAT_OBJECT: 1,
      BIND_OUT: 2002,
      NUMBER: 'number',
    },
  };
});

jest.mock('../middleware/verifyToken', () => (req, res, next) => next());

const db = require('../config/db');

const validToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'defaultSecret');

describe('📦 ProductController', () => {
  let conn;

  beforeEach(() => {
    jest.clearAllMocks();
    conn = {
      execute: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      close: jest.fn(),
    };
    db.getConnection.mockResolvedValue(conn);
  });

  test('GET /products - debería retornar todos los productos', async () => {
    conn.execute.mockResolvedValueOnce({
      rows: [
        {
          PRODUCT_ID: 1,
          NAME: 'Silla',
          UNITARY_PRICE: 15.5,
          DESCRIPTION: 'Plástica',
          TYPE: 'Mobiliario',
        },
      ],
    });

    const res = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        name: 'Silla',
        price: 15.5,
        description: 'Plástica',
        type: 'Mobiliario',
      },
    ]);
  });

  test('GET /products/:id - debería retornar un producto por ID', async () => {
    conn.execute.mockResolvedValueOnce({
      rows: [{
        PRODUCT_ID: 2,
        NAME: 'Carpa',
        UNITARY_PRICE: 100,
        DESCRIPTION: 'Grande',
        TYPE: 'Accesorio',
      }],
    });

    const res = await request(app)
      .get('/products/2')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      PRODUCT_ID: 2,
      NAME: 'Carpa',
      UNITARY_PRICE: 100,
      DESCRIPTION: 'Grande',
      TYPE: 'Accesorio',
    });
  });

  test('POST /products - debería crear un producto', async () => {
    conn.execute.mockResolvedValueOnce({
      outBinds: { product_id: [101] },
    });

    const newProduct = {
      name: 'Mesa',
      unitary_price: 30,
      description: 'Plegable',
      type: 'Mobiliario',
    };

    const res = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ product_id: 101 });
  });

  test('PUT /products/:id - debería actualizar un producto', async () => {
    conn.execute.mockResolvedValueOnce();

    const res = await request(app)
      .put('/products/2')
      .send({
        name: 'Carpa XL',
        unitary_price: 120,
        description: 'Gigante',
        type: 'Accesorio',
      })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(204);
  });

  test('DELETE /products/:id - debería eliminar un producto', async () => {
    conn.execute.mockResolvedValueOnce();

    const res = await request(app)
      .delete('/products/2')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(204);
  });

  test('DELETE /products/:id - error en DB debe hacer rollback', async () => {
    conn.execute.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .delete('/products/2')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(500);
    expect(conn.rollback).toHaveBeenCalled();
    expect(conn.close).toHaveBeenCalled();
  });
});
