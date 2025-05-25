const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const zonesController = require('../controllers/zonesController');

router.get('/', zonesController.getAllZones);
router.get('/:id', zonesController.getZoneById);
router.post('/', zonesController.createZone);
router.put('/:id', zonesController.updateZone);
router.delete('/:id', zonesController.deleteZone);


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

router.post('/upload-image', upload.single('image'), zonesController.uploadZoneImage);

module.exports = router;