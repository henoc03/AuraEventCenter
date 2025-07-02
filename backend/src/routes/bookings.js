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
router.post('/create', bookingsController.createBooking);
router.post('/update', bookingsController.updateBooking);
router.delete('/:id', bookingsController.deleteBooking);
router.post('/payment-summary', bookingsController.getPaymentSummary);
router.post('/update-payment', bookingsController.updateInvoicePayment);
router.get('/by-booking/:bookingId', bookingsController.getInvoiceByBooking);

module.exports = router;