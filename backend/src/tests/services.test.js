/* global jest, describe, it, expect, beforeEach */
require('../utils/encryption');
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

describe('Services Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /services - debería devolver todos los servicios', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { ADDITIONAL_SERVICE_ID: 1, NAME: 'Servicio A', DESCRIPTION: 'Desc A', PRICE: 100, IMAGE_PATH: 'encrypted_pathA' },
          { ADDITIONAL_SERVICE_ID: 2, NAME: 'Servicio B', DESCRIPTION: 'Desc B', PRICE: 200, IMAGE_PATH: null },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/services')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { ID: 1, name: 'Servicio A', description: 'Desc A', price: 100, imagePath: 'pathA', active: undefined },
      { ID: 2, name: 'Servicio B', description: 'Desc B', price: 200, imagePath: null, active: undefined },
    ]);
  });

  it('GET /services/:id - debería devolver un servicio por ID', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [
          { ADDITIONAL_SERVICE_ID: 1, NAME: 'Servicio A', DESCRIPTION: 'Desc A', PRICE: 100, IMAGE_PATH: 'encrypted_pathA' },
        ],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/services/1')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ADDITIONAL_SERVICE_ID: 1, NAME: 'Servicio A', DESCRIPTION: 'Desc A', PRICE: 100, IMAGE_PATH: 'pathA' });
  });

  it('GET /services/:serviceId/images - debería devolver todas las imágenes de un servicio', async () => {
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
      .get('/services/1/images')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 'main', path: 'mainImage' },
      { id: 10, path: 'secondary1' },
      { id: 11, path: 'secondary2' },
    ]);
  });

  it('GET /services/:id - debería devolver objeto vacío si no existe el servicio', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({ rows: [] }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/services/999')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({});
  });

  it('GET /services - error de base de datos', async () => {
    db.getConnection.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app)
      .get('/services')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
