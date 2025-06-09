const { encrypt, decrypt } = require('../utils/encryption');
const mockFs = require('mock-fs');
const db = require('../config/db');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

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

const validToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'defaultSecret');

describe('Menus Controller', () => {
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

  test('GET /menus - debería devolver todos los menús', async () => {
    conn.execute.mockResolvedValueOnce({
      rows: [
        { MENU_ID: 1, NAME: 'Menu 1', DESCRIPTION: 'Desc 1', PRICE: 100, IMAGE_PATH: 'encrypted_path1', AVAILABLE: 1, TYPE: 'Buffet' },
        { MENU_ID: 2, NAME: 'Menu 2', DESCRIPTION: 'Desc 2', PRICE: 200, IMAGE_PATH: null, AVAILABLE: 0, TYPE: 'A la carta' },
      ],
    })
    .mockResolvedValueOnce({
      rows: [
        { MENU_ID: 1, PRODUCT_ID: 10, NAME: 'Producto 1', DESCRIPTION: 'Desc P1', UNITARY_PRICE: 50 },
        { MENU_ID: 1, PRODUCT_ID: 11, NAME: 'Producto 2', DESCRIPTION: 'Desc P2', UNITARY_PRICE: 50 },
        { MENU_ID: 2, PRODUCT_ID: 12, NAME: 'Producto 3', DESCRIPTION: 'Desc P3', UNITARY_PRICE: 200 },
      ],
    });

    const res = await request(app)
      .get('/menus')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('MENU_ID', 1);
    expect(res.body[0]).toHaveProperty('PRODUCTS');
  });

  test('GET /menus/:id - debería devolver un menú por ID', async () => {
    conn.execute.mockResolvedValueOnce({
      rows: [
        { MENU_ID: 1, NAME: 'Menu 1', DESCRIPTION: 'Desc 1', PRICE: 100, IMAGE_PATH: 'encrypted_path1', ACTIVE: 1 },
      ],
    });

    const res = await request(app)
      .get('/menus/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('MENU_ID', 1);
    expect(res.body).toHaveProperty('IMAGE_PATH', 'path1');
  });

  test('GET /menus/:menuId/images - debería devolver todas las imágenes de un menú', async () => {
    conn.execute
      .mockResolvedValueOnce({ rows: [{ IMAGE_PATH: 'encrypted_main.jpg' }] })
      .mockResolvedValueOnce({ rows: [
        { IMAGE_ID: 1, IMAGE_ADDRESS: 'encrypted_sec1.jpg' },
        { IMAGE_ID: 2, IMAGE_ADDRESS: 'encrypted_sec2.jpg' },
      ] });

    const res = await request(app)
      .get('/menus/1/images')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('id', 'main');
    expect(res.body[1]).toHaveProperty('id', 1);
  });

  test('POST /menus - debería crear un menú', async () => {
    conn.execute
      .mockResolvedValueOnce({ rows: [ { PRODUCT_ID: 10, UNITARY_PRICE: 100 } ] })
      .mockResolvedValueOnce({ outBinds: { menuId: [5] } })
      .mockResolvedValue({});
    conn.commit.mockResolvedValue();

    const res = await request(app)
      .post('/menus')
      .send({
        name: 'Menu Nuevo',
        description: 'Desc Nuevo',
        type: 'Buffet',
        available: 1,
        imagePath: 'img.jpg',
        products: [10],
      })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('menu_id', 5);
  });

  test('PUT /menus/:id - debería actualizar un menú', async () => {
    conn.execute
      .mockResolvedValueOnce({ rows: [ { PRODUCT_ID: 10, UNITARY_PRICE: 100 } ] })
      .mockResolvedValue({});

    const res = await request(app)
      .put('/menus/1')
      .send({
        name: 'Menu Editado',
        description: 'Desc Editado',
        type: 'Buffet',
        available: 1,
        imagePath: 'img.jpg',
        products: [10],
        isEncrypted: false
      })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /menus/:id - debería eliminar un menú', async () => {
    conn.execute
      .mockResolvedValueOnce({ rows: [{ IMAGE_PATH: 'encrypted_main.jpg' }] })
      .mockResolvedValue({});
    conn.commit.mockResolvedValue();

    const res = await request(app)
      .delete('/menus/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(204);
    expect(conn.commit).toHaveBeenCalled();
  });

  test('DELETE /menus/:id - error en DB debe hacer rollback', async () => {
    conn.execute.mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app)
      .delete('/menus/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(500);
    expect(conn.rollback).toHaveBeenCalled();
    expect(conn.close).toHaveBeenCalled();
  });
});
