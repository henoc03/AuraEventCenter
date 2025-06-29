const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

router.get('/:id', bookingsController.getBookingById);

module.exports = router;