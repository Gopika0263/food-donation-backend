const Donation = require("../models/Donation");

// ================== Create a new donation (Donor only) ==================
exports.createDonation = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ msg: "Only donors can create donations" });
    }

    const { foodType, quantity, pickupAddress } = req.body;
    if (!foodType || !quantity || !pickupAddress) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newDonation = new Donation({
      donor: req.user.userId,
      foodType,
      quantity,
      pickupAddress,
    });

    await newDonation.save();
    res.status(201).json({ msg: "Donation created", donation: newDonation });
  } catch (err) {
    console.error("❌ Create donation error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Get all available donations (Public) ==================
exports.getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "available" }).populate(
      "donor",
      "name"
    );
    res.json(donations);
  } catch (err) {
    console.error("❌ Get donations error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Claim a donation (Receiver only) ==================
exports.claimDonation = async (req, res) => {
  try {
    if (req.user.role !== "receiver") {
      return res
        .status(403)
        .json({ msg: "Only receivers can claim donations" });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    if (donation.status !== "available") {
      return res
        .status(400)
        .json({ msg: "Donation already claimed or expired" });
    }

    donation.status = "claimed";
    donation.receiver = req.user.userId; // save receiver id
    await donation.save();

    res.json({ msg: "Donation claimed successfully", donation });
  } catch (err) {
    console.error("❌ Claim donation error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Get donations created by logged-in donor ==================
exports.getMyDonations = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res
        .status(403)
        .json({ msg: "Only donors can view their donations" });
    }

    const donations = await Donation.find({ donor: req.user.userId });
    res.json(donations);
  } catch (err) {
    console.error("❌ Get my donations error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Get donations claimed by logged-in receiver ==================
exports.getMyClaims = async (req, res) => {
  try {
    if (req.user.role !== "receiver") {
      return res
        .status(403)
        .json({ msg: "Only receivers can view their claimed donations" });
    }

    const donations = await Donation.find({
      receiver: req.user.userId,
    }).populate("donor", "name");

    res.json(donations);
  } catch (err) {
    console.error("❌ Get my claims error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Mark donation as picked up (Donor only) ==================
exports.pickupDonation = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res
        .status(403)
        .json({ msg: "Only donors can mark donations as picked up" });
    }

    const donationId = req.params.id;
    const donation = await Donation.findById(donationId);

    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    if (!donation.donor || donation.donor.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ msg: "You can only update your own donations" });
    }

    if (donation.status !== "claimed") {
      return res.status(400).json({ msg: "Donation not yet claimed" });
    }

    donation.status = "pickedUp";
    await donation.save();

    res.json({ msg: "Donation marked as picked up", donation });
  } catch (err) {
    console.error("❌ Pickup donation error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Mark donation as delivered (Donor only) ==================
// ================== Mark donation as delivered (Donor or Admin) ==================
exports.deliverDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    // Only donor or admin can mark delivered
    if (req.user.role === "donor") {
      if (donation.donor.toString() !== req.user.userId) {
        return res.status(403).json({ msg: "Not authorized" });
      }
    } else if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Only donors or admins can mark as delivered" });
    }

    if (donation.status !== "pickedUp") {
      return res.status(400).json({ msg: "Donation not yet picked up" });
    }

    donation.status = "delivered";
    donation.deliveredAt = new Date();
    await donation.save();

    res.json({ msg: "Donation marked as delivered", donation });
  } catch (err) {
    console.error("❌ Deliver donation error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================== Mark donation as completed (Receiver or Admin) ==================
exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    // Only receiver or admin can mark completed
    if (req.user.role === "receiver") {
      if (donation.receiver.toString() !== req.user.userId) {
        return res.status(403).json({ msg: "Not authorized" });
      }
    } else if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Only receivers or admins can mark as completed" });
    }

    if (donation.status !== "delivered") {
      return res.status(400).json({ msg: "Donation not yet delivered" });
    }

    donation.status = "completed";
    donation.completedAt = new Date();
    await donation.save();

    res.json({ msg: "Donation marked as completed", donation });
  } catch (err) {
    console.error("❌ Complete donation error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
