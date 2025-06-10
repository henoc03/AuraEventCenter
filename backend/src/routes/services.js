const express = require('express');
const router = express.Router();
const upload = require("../utils/upload");
const servicesController = require('../controllers/servicesController');


router.get('/', servicesController.getAllServices);
router.get('/:id', servicesController.getServiceById);
router.get('/:serviceId/images', servicesController.getAllServiceImages);
router.post("/", upload.single("image"), servicesController.createService);
router.put("/:id", upload.single("image"), servicesController.updateService)
router.delete('/:id', servicesController.deleteService);
router.post("/upload-image", upload.single("image"), servicesController.uploadImage);


module.exports = router;