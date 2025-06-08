const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const usersController = require('../controllers/usersController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/users');
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

// Rutas de la API
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.get('/getNameEmail/:id', usersController.getNameEmail);
router.get('/getNameLastNameRole/:id', usersController.getNameLastnameRole);
router.post('/', usersController.createUser);
router.put('/deactivate', verifyToken, usersController.deactivateUser);
router.put('/:id', usersController.updateUser);
router.put('/profile/:id', upload.single('image'), usersController.updateProfile);
router.delete('/:id', usersController.deleteUser);
router.post('/login', usersController.login);
router.post('/register', usersController.registerUser);


module.exports = router;