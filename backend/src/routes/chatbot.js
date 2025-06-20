const express = require('express');
const router = express.Router();
const { chatbotResponse } = require('../controllers/chatbotController');

router.post('/chat', chatbotResponse);

module.exports = router;
