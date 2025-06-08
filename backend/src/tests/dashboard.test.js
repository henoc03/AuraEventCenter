const httpMocks = require('node-mocks-http');

// Mocks para db y oracledb
const mockExecute = jest.fn();
const mockClose = jest.fn();

const mockGetConnection = jest.fn(() => ({
  execute: mockExecute,
  close: mockClose,
}));

const mockOracledb = {
  BIND_OUT: 'BIND_OUT',
  NUMBER: 'NUMBER',
  CURSOR: 'CURSOR',
};

jest.mock('../config/db', () => ({
  getConnection: mockGetConnection,
  oracledb: mockOracledb,
}));

const dashboardController = require('../controllers/dashboardController');

describe('dashboardController', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('debe devolver estadísticas del dashboard', async () => {
      mockExecute.mockResolvedValueOnce({
        outBinds: {
          p_users: 15,
          p_rooms: 5,
          p_events: 10,
        },
      });

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.json = jest.fn();

      await dashboardController.getDashboardStats(req, res);

      expect(res.json).toHaveBeenCalledWith({
        users: 15,
        activeRooms: 5,
        eventsThisWeek: 10,
      });
    });
  });

  describe('getWeeklyReservations', () => {
    it('debe devolver las reservas de la semana', async () => {
        const mockRows = [
        ['Aprobado', 'Juan Pérez', new Date('2025-06-08T12:00:00')],
        ['Pendiente', 'Ana Gómez', new Date('2025-06-09T12:00:00')],
        ];


      const mockResultSet = {
        getRows: jest.fn().mockResolvedValue(mockRows),
        close: jest.fn(),
      };

      mockExecute.mockResolvedValueOnce({
        outBinds: { p_cursor: mockResultSet },
      });

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.json = jest.fn();

      await dashboardController.getWeeklyReservations(req, res);

        expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
            expect.objectContaining({
            status: 'Aprobado',
            owner: 'Juan Pérez',
            date: expect.stringMatching(/^\w{3},\s\d{1,2}\s\w{3}\s\d{4}$/),
            }),
            expect.objectContaining({
            status: 'Pendiente',
            owner: 'Ana Gómez',
            date: expect.stringMatching(/^\w{3},\s\d{1,2}\s\w{3}\s\d{4}$/),
            }),
        ])
        );


    });
  });

  describe('getMostBookedRooms', () => {
    it('debe devolver las salas más reservadas', async () => {
      const mockRows = [
        ['Sala A', 8],
        ['Sala B', 5],
      ];

      const mockResultSet = {
        getRows: jest.fn().mockResolvedValue(mockRows),
        close: jest.fn(),
      };

      mockExecute.mockResolvedValueOnce({
        outBinds: { p_cursor: mockResultSet },
      });

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.json = jest.fn();

      await dashboardController.getMostBookedRooms(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { roomName: 'Sala A', reservations: 8 },
        { roomName: 'Sala B', reservations: 5 },
      ]);
    });
  });

});
