const express = require("express");
const router = express.Router();

const { charges, verifyPayment } = require("../controllers/payment");

router.post("/make-payments", charges);

router.post("/verify-payments", verifyPayment);

module.exports = router;
