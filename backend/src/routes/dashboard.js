// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
router.use((req, res, next) => {
  console.log(`[Router zones] ${req.method} ${req.originalUrl}`);
  next();
});
router.get('/stats', dashboardController.getDashboardStats);
router.get('/weekly-reservations', dashboardController.getWeeklyReservations);
router.get('/clients', dashboardController.getAllClients);
router.get('/admins', dashboardController.getAllAdmins);
router.get('/top-rooms', dashboardController.getMostBookedRooms);


module.exports = router;
