const express = require('express');
const router = express.Router();
const menusController = require('../controllers/menusController');

router.get('/', menusController.getAllMenus);
router.get('/:id', menusController.getMenuById);
router.get('/:menuId/images', menusController.getAllMenuImages);
router.post('/', menusController.createMenu);

module.exports = router;