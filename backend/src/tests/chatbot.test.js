const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

jest.mock('../config/db', () => ({
  getConnection: jest.fn(),
}));

describe('POST /chatbot', () => {
  beforeEach(() => {
    db.getConnection.mockReset();
    db.getConnection.mockResolvedValue({
      execute: jest.fn().mockImplementation((query) => {
        // Simula diferentes respuestas según el query
        if (query.includes('ADDITIONAL_SERVICES')) {
          return { rows: [['Servicio Demo', 'Incluye todo']] };
        }
        if (query.includes('ZONES')) {
          return { rows: [['Sala Demo', 100]] };
        }
        if (query.includes('BOOKINGS_ZONES')) {
          return { rows: [[0]] };
        }
        return { rows: [] };
      }),
      close: jest.fn(),
    });
  });

  it('debería consultar precio de una sala', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: '¿Cuál es el precio de la Sala Demo?', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería consultar detalles de un servicio', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: '¿Qué incluye el Servicio Demo?', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería consultar disponibilidad', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: '¿Está disponible la Sala Demo para el 2025-12-01?', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería manejar error de base de datos', async () => {
    db.getConnection.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'Hola', context: {} });
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('response');
  });

  it('debería pedir confirmación si no encuentra la sala exacta', async () => {
    // Simula búsqueda difusa (no encuentra exacto)
    db.getConnection.mockResolvedValueOnce({
      execute: jest.fn().mockImplementation((query) => {
        if (query.includes('ZONES')) return { rows: [['Sala Demo', 100], ['Sala Dema', 120]] };
        return { rows: [] };
      }),
      close: jest.fn(),
    });
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'Cotizar Sala Dema', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería manejar contexto pendiente y respuesta sí', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'sí', context: { pendingIntent: 'cotizar', pendingName: 'Sala Demo' } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería manejar contexto pendiente y respuesta no', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'no', context: { pendingIntent: 'cotizar', pendingName: 'Sala Demo' } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería pedir aclaración si no entiende la confirmación', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'quizás', context: { pendingIntent: 'cotizar', pendingName: 'Sala Demo' } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería pedir fecha si no se especifica en disponibilidad', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: '¿Está disponible la Sala Demo?', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería responder a saludo', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'Hola', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });

  it('debería responder a mensaje no reconocido', async () => {
    const res = await request(app)
      .post('/chatbot')
      .send({ message: 'asdasdasd', context: {} });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
  });
});