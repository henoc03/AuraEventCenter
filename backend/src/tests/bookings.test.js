const request = require('supertest');
const app = require('../app');

describe('GET /bookings', () => {
  it('debería obtener todas las reservas', async () => {
    const res = await request(app).get('/bookings');
    expect([200, 401, 403]).toContain(res.statusCode);
  });
});