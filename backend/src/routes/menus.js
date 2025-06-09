const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const menusController = require('../controllers/menusController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/menus');
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

router.post('/upload-primary-image', upload.single('image'), menusController.uploadMenuPrimaryImage);
router.get('/', menusController.getAllMenus);
router.get('/:id', menusController.getMenuById);
router.get('/:menuId/images', menusController.getAllMenuImages);
router.post('/', menusController.createMenu);

module.exports = router;