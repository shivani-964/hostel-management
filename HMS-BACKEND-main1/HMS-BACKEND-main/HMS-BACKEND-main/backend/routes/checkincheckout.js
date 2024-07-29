const express = require("express");
const router = express.Router();
const checkinCheckoutController = require("../controllers/checkinCheckoutcontroller");

router.post("/checkin", checkinCheckoutController.checkin);

router.post("/checkout", checkinCheckoutController.checkout);

router.get("/student/:studentId", checkinCheckoutController.getStudentCheckins);

router.get("/all", checkinCheckoutController.getAllCheckinCheckouts);

module.exports = router;
