const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/recuperar/enviar-codigo', emailController.sendRecoveryCode);
router.post('/recuperar/verificar-codigo', emailController.verifyCode);
router.post('/recuperar/cambiar-password', emailController.resetPassword);
router.post('/contactar', emailController.contact);

module.exports = router;
