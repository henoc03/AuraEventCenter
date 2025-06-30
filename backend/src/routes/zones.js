const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const zonesController = require('../controllers/zonesController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/zones');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/', zonesController.getAllZones);
router.get('/:id', zonesController.getZoneById);
router.post('/', zonesController.createZone);
router.post('/available', zonesController.getAllAvailableZones);
router.put('/:id', zonesController.updateZone);
router.delete('/:id', zonesController.deleteZone);

router.post('/upload-primary-image', upload.single('image'), zonesController.uploadZonePrimaryImage);
router.post('/upload-secondary-image', upload.single('image'), zonesController.uploadZoneSecondaryImage);
router.get('/:zoneId/images', zonesController.getAllZoneImages);
router.delete('/images/:imageId', zonesController.deleteZoneSecondaryImage);


router.delete('/:id/delete-primary-image', zonesController.deleteZonePrimaryImage);
module.exports = router;