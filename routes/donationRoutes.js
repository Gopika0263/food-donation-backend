const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // <-- add

const {
  createDonation,
  getAvailableDonations,
  claimDonation,
  getMyDonations,
  getMyClaims,
  pickupDonation,
  deliverDonation,
  completeDonation,
} = require("../controllers/donationController");

// Create donation (Donor only) with image
router.post("/", authMiddleware, upload.single("image"), createDonation);

// rest of routes remain the same
router.get("/", authMiddleware, getAvailableDonations);
router.put("/:id/claim", authMiddleware, claimDonation);
router.put("/:id/pickup", authMiddleware, pickupDonation);
router.put("/:id/deliver", authMiddleware, deliverDonation);
router.put("/:id/complete", authMiddleware, completeDonation);
router.get("/my/donations", authMiddleware, getMyDonations);
router.get("/my/claims", authMiddleware, getMyClaims);

module.exports = router;
