const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

router.get('/zones/:id', bookingsController.getBookingZones);
router.get('/:id', bookingsController.getBookingById);

module.exports = router;