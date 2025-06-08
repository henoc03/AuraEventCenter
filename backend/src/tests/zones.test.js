const { encrypt, decrypt } = require('../utils/encryption');
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
    getConnection: jest.fn(() => {
      return {
        execute: jest.fn((query, params, options) => {
          if (query.includes("SELECT i.IMAGE_ADDRESS, i.IMAGE_ID")) {
            return Promise.resolve({
              rows: [
                { IMAGE_ADDRESS: "encrypted_path_1", IMAGE_ID: 101 },
                { IMAGE_ADDRESS: "encrypted_path_2", IMAGE_ID: 102 },
              ],
            });
          }
          if (query.includes("SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID")) {
            return Promise.resolve({ rows: [{ IMAGE_PATH: "encrypted_main_path" }] });
          }
          if (query.startsWith("DELETE")) {
             return Promise.resolve({ rows: [] });
          }
          return Promise.resolve({ rows: [] });
        }),
        commit: jest.fn(),
        rollback: jest.fn(),
        close: jest.fn(),
      };
    }),
    oracledb: {
      OUT_FORMAT_OBJECT: 1,
      BIND_OUT: 2002,
      NUMBER: 'number',
    }
  };
});


const db = require('../config/db');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

jest.mock('../middleware/verifyToken', () => (req, res, next) => next());

let zoneId;
const validToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'defaultSecret');

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
  console.warn.mockRestore();
});
describe('Zones Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /zones - debería devolver todas las zonas', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Sala A' }],
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .get('/zones')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Sala A', IMAGE_PATH: null }]);
  });

  it('POST /zones - debería crear una zona', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        outBinds: {
          zone_id: [2],
        },
      }),
      close: jest.fn(),
    });

    const res = await request(app)
      .post('/zones')
      .send({ name: 'Sala B', description: 'Nueva sala' })
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ zone_id: 2 });
  });

  it('POST /zones - crear zona para pruebas', async () => {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({
        outBinds: {
          zone_id: [999],
        },
      }),
      close: jest.fn(),
    });

    const createRes = await request(app)
      .post('/zones')
      .send({
        name: 'Zona Test',
        description: 'Descripción de zona test',
        capacity: 10,
        type: 'Tipo Test',
        event_center_id: 1,
        price: 100,
        imagePath: null,
      })
      .set('Authorization', `Bearer ${validToken}`);

    expect(createRes.statusCode).toBe(201);
    zoneId = createRes.body.zone_id;
  });
});
describe('Endpoints /zones/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

test('PUT /zones/:id - Actualizar zona', async () => {
  db.getConnection.mockResolvedValueOnce({
    execute: jest.fn().mockResolvedValueOnce({
      rows: [{ id: zoneId, name: 'Zona Actualizada' }],
      rowsAffected: 1,
      outBinds: {},
    }),
    close: jest.fn(),
  });

  const res = await request(app)
    .put(`/zones/${zoneId}`)
    .send({
      name: 'Zona Actualizada',
      description: 'Descripción actualizada',
      capacity: 20,
      type: 'Tipo Actualizado',
      event_center_id: 1,
      price: 150,
      imagePath: null,
    })
    .set('Authorization', `Bearer ${validToken}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ message: 'Zona actualizada correctamente' });
});

describe('DELETE /zones/:id', () => {

  beforeEach(() => {
    mockFs({
      'backend/src/uploads/zones': {
        'main.jpg': 'contenido falso de main.jpg',
        'sec1.jpg': 'contenido falso de sec1.jpg',
        'sec2.jpg': 'contenido falso de sec2.jpg',
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });
  it('debería eliminar una zona con sus imágenes y archivos físicos', async () => {
    const fakeConn = {
      execute: jest.fn((query, params, options) => {
        if (typeof query === 'string') {
          if (query.includes("SELECT i.IMAGE_ADDRESS, i.IMAGE_ID")) {
            return Promise.resolve({
              rows: [
                { IMAGE_ADDRESS: encrypt('uploads/zones/sec1.jpg'), IMAGE_ID: 201 },
                { IMAGE_ADDRESS: encrypt('uploads/zones/sec2.jpg'), IMAGE_ID: 202 },
              ],
            });
          }
          if (query.includes("SELECT IMAGE_PATH FROM ADMIN_SCHEMA.ZONES WHERE ZONE_ID")) {
            return Promise.resolve({
              rows: [{ IMAGE_PATH: encrypt('uploads/zones/main.jpg') }],
            });
          }
          if (query.startsWith("DELETE")) {
            return Promise.resolve({ rows: [] });
          }
        }
        return Promise.resolve({ rows: [] });
      }),
      commit: jest.fn(),
      rollback: jest.fn(),
      close: jest.fn(),

  
};

db.getConnection.mockResolvedValueOnce(fakeConn);


    const res = await request(app)
      .delete('/zones/123')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toBe(204);
    expect(fakeConn.execute).toHaveBeenCalledTimes(7);
    expect(fakeConn.commit).toHaveBeenCalled();
    expect(fakeConn.rollback).not.toHaveBeenCalled();
    expect(fakeConn.close).toHaveBeenCalled();
    
  });
it('debería retornar error 500 y hacer rollback si falla', async () => {

  const fakeConn = {
    execute: jest.fn().mockRejectedValueOnce(new Error('DB error')),
    commit: jest.fn(),
    rollback: jest.fn(),
    close: jest.fn(),
  };
  db.getConnection.mockResolvedValueOnce(fakeConn);

  const res = await request(app)
    .delete('/zones/123')
    .set('Authorization', `Bearer ${validToken}`);

  expect(res.statusCode).toBe(500);
  expect(fakeConn.rollback).toHaveBeenCalled();
  expect(fakeConn.close).toHaveBeenCalled();

});

});

});


// Limpieza después de todos los tests
afterAll(async () => {
  if (zoneId) {
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockResolvedValueOnce({}),
      close: jest.fn(),
    });

    await request(app)
      .delete(`/zones/${zoneId}`)
      .set('Authorization', `Bearer ${validToken}`);
  }
});
