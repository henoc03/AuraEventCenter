const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.get('/:serviceId/images', servicesController.getAllServiceImages);

module.exports = router;