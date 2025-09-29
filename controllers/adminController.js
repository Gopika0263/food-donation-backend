const Donation = require("../models/Donation");

// ✅ View all donations (with donor + receiver info)
exports.getAllDonations = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, Admins only" });
    }

    const donations = await Donation.find()
      .populate("donor", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error("❌ Admin getAllDonations error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update donation status manually (Admin control)
exports.updateDonationStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, Admins only" });
    }

    const { status } = req.body; // e.g., "delivered", "completed"
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!donation) return res.status(404).json({ msg: "Donation not found" });

    res.json({ msg: "Status updated successfully", donation });
  } catch (err) {
    console.error("❌ Admin updateDonationStatus error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
