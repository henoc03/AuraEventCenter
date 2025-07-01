const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

router.post('/equipments', bookingsController.getBookingEquipments);
router.post('/menus', bookingsController.getBookingMenus);
router.post('/services', bookingsController.getBookingServices);
router.get('/zones/:id', bookingsController.getBookingZones);
router.get('/:id', bookingsController.getBookingById);
router.post('/create', bookingsController.createBooking);


module.exports = router;