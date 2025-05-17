const express = require('express');
const router = express.Router();
const zonesController = require('../controllers/zonesController');

router.get('/', zonesController.getAllZones);
router.get('/:id', zonesController.getZoneById);
router.post('/', zonesController.createZone);
router.put('/:id', zonesController.updateZone);
router.delete('/:id', zonesController.deleteZone);

module.exports = router;