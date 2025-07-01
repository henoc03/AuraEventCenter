const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const bookingsController = require('../controllers/bookingsController');

router.get('/', bookingsController.getAllBookings);
router.post('/equipments', bookingsController.getBookingEquipments);
router.post('/menus', bookingsController.getBookingMenus);
router.post('/services', bookingsController.getBookingServices);
router.get('/zones/:id', bookingsController.getBookingZones);
router.get('/my', verifyToken, bookingsController.getMyBookings);
router.get('/:id', bookingsController.getBookingById);
router.delete('/:id', bookingsController.deleteBooking);

module.exports = router;