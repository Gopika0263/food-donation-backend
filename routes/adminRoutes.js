const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllDonations,
  updateDonationStatus,
} = require("../controllers/adminController");

// Admin: Get all donations
router.get("/donations", authMiddleware, getAllDonations);

// Admin: Update donation status
router.put("/donations/:id", authMiddleware, updateDonationStatus);

module.exports = router;
