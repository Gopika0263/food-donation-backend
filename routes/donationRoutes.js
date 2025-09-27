const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createDonation,
  getAvailableDonations,
  claimDonation,
  getMyDonations,
  getMyClaims,
  pickupDonation, // already existing
  deliverDonation, // 🔥 new
  completeDonation, // 🔥 new
} = require("../controllers/donationController");

// Create donation (Donor only)
router.post("/", authMiddleware, createDonation);

// Get available donations (Public)
router.get("/", getAvailableDonations);

// Claim donation (Receiver only)
router.put("/:id/claim", authMiddleware, claimDonation);

// Mark donation as picked up (Donor only)
router.put("/:id/pickup", authMiddleware, pickupDonation);

// Mark donation as delivered (Donor only)
router.put("/:id/deliver", authMiddleware, deliverDonation);

// Mark donation as completed (Receiver only)
router.put("/:id/complete", authMiddleware, completeDonation);

// Get my donations (Donor only)
router.get("/my/donations", authMiddleware, getMyDonations);

// Get my claimed donations (Receiver only)
router.get("/my/claims", authMiddleware, getMyClaims);

module.exports = router;
