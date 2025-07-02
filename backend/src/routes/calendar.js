const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/getCalendar', calendarController.getCalendarReservations);

module.exports = router;