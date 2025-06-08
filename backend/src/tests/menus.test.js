const { encrypt, decrypt } = require('../utils/encryption');
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
    getConnection: jest.fn(),
    oracledb: {
      OUT_FORMAT_OBJECT: 1,
      BIND_OUT: 2002,
      NUMBER: 'number',
    }
  };
});

jest.mock('../middleware/verifyToken', () => (req, res, next) => next());

const validToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'defaultSecret');

describe('Menus Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /menus - debería devolver todos los menús', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn()
        .mockResolvedValueOnce({
          rows: [
            { MENU_ID: 1, NAME: 'Menú A', DESCRIPTION: 'Desc A', PRICE: 0, IMAGE_PATH: 'encrypted_pathA', AVAILABLE: 1, TYPE: 'Buffet' },
            { MENU_ID: 2, NAME: 'Menú B', DESCRIPTION: 'Desc B', PRICE: 0, IMAGE_PATH: null, AVAILABLE: 1, TYPE: 'Plato' },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            { MENU_ID: 1, PRODUCT_ID: 10, NAME: 'Producto 1', DESCRIPTION: 'Prod Desc 1', UNITARY_PRICE: 100 },
            { MENU_ID: 1, PRODUCT_ID: 11, NAME: 'Producto 2', DESCRIPTION: 'Prod Desc 2', UNITARY_PRICE: 200 },
            { MENU_ID: 2, PRODUCT_ID: 12, NAME: 'Producto 3', DESCRIPTION: 'Prod Desc 3', UNITARY_PRICE: 300 },
          ],
        }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/menus')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
        MENU_ID: 1,
        NAME: 'Menú A',
        DESCRIPTION: 'Desc A',
        PRICE: 300,
        IMAGE_PATH: 'pathA',
        AVAILABLE: 1,
        TYPE: 'Buffet',
        PRODUCTS: [
          { PRODUCT_ID: 10, NAME: 'Producto 1', DESCRIPTION: 'Prod Desc 1', UNITARY_PRICE: 100 },
          { PRODUCT_ID: 11, NAME: 'Producto 2', DESCRIPTION: 'Prod Desc 2', UNITARY_PRICE: 200 },
        ]
      },
      {
        MENU_ID: 2,
        NAME: 'Menú B',
        DESCRIPTION: 'Desc B',
        PRICE: 300,
        IMAGE_PATH: null,
        AVAILABLE: 1,
        TYPE: 'Plato',
        PRODUCTS: [
          { PRODUCT_ID: 12, NAME: 'Producto 3', DESCRIPTION: 'Prod Desc 3', UNITARY_PRICE: 300 },
        ]
      }
    ]);
  });

  it('GET /menus/:id - debería devolver un menú por ID', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { MENU_ID: 1, NAME: 'Menú A', DESCRIPTION: 'Desc A', PRICE: 300, IMAGE_PATH: 'encrypted_pathA', ACTIVE: 1 },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/menus/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ MENU_ID: 1, NAME: 'Menú A', DESCRIPTION: 'Desc A', PRICE: 300, IMAGE_PATH: 'pathA', ACTIVE: 1 });
  });

  it('GET /menus/:menuId/images - debería devolver todas las imágenes de un menú', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn()
        .mockResolvedValueOnce({ rows: [{ IMAGE_PATH: 'encrypted_mainImage' }] }) // main image
        .mockResolvedValueOnce({
          rows: [
            { IMAGE_ID: 10, IMAGE_ADDRESS: 'encrypted_secondary1' },
            { IMAGE_ID: 11, IMAGE_ADDRESS: 'encrypted_secondary2' },
          ],
        }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/menus/1/images')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 'main', path: 'mainImage' },
      { id: 10, path: 'secondary1' },
      { id: 11, path: 'secondary2' },
    ]);
  });

  it('GET /menus/:id - debería devolver objeto vacío si no existe el menú', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({ rows: [] }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/menus/999')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });

  it('GET /menus - error de base de datos', async () => {
    db.getConnection.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app)
      .get('/menus')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
