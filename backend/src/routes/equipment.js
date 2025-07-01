const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const equipmentsController = require("../controllers/equipmentController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath =  path.join(__dirname, '../uploads/equipments');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/upload-image", upload.single("image"), equipmentsController.uploadImage);
router.get("/", equipmentsController.getAllEquipments);
router.get('/:id', equipmentsController.getEquipmentById);
router.post("/", equipmentsController.createEquipment);
router.post("/available", equipmentsController.getAllAvailableEquipments);
router.put("/:id", equipmentsController.updateEquipment);
router.delete("/:id", equipmentsController.deleteEquipment);

module.exports = router;
