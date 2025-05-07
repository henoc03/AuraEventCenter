const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas de la API
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.get('/getNameEmail/:id', usersController.getNameEmail);
router.get('/getNameLastNameRole/:id', usersController.getNameLastnameRole);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.post('/login', usersController.login);
router.post('/register', usersController.registerUser);


module.exports = router;