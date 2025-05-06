const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas de la API
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.post('/login', usersController.login);

module.exports = router;