const express = require('express');
const router = express.Router();
const zonesController = require('../controllers/zonesController');

// Rutas para ZONES
router.get('/', zonesController.getAllZones);
router.get('/:id', zonesController.getZoneById);
router.post('/', zonesController.createZone);
router.put('/:id', zonesController.updateZone);
router.delete('/:id', zonesController.deleteZone);

// Rutas para IMAGES asociadas a una zona específica
router.get('/:zone_id/images', zonesController.getImagesByZoneId);
router.post('/:zone_id/images', zonesController.createImage);

// Rutas para operaciones individuales sobre IMAGES
router.put('/images/:image_id', zonesController.updateImage);
router.delete('/images/:image_id', zonesController.deleteImage);

module.exports = router;
