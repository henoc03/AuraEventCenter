const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const verifyToken = require("../middleware/verifyToken");

// router.post("/", verifyToken, bookingController.createBooking);
router.get("/:bookingId/detail", verifyToken,bookingController.getBookingDetailForInvoice);
// router.post("/confirm-payment", verifyToken, bookingController.confirmPayment);

module.exports = router;