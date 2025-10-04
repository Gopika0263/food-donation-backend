const Donation = require("../models/Donation");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

// Create Donation
exports.createDonation = async (req, res) => {
  try {
    const {
      foodType,
      quantity,
      pickupAddress,
      phone,
      expiry,
      cookedTime,
      location,
      organization,
    } = req.body;

    let imageUrl = "";
    if (req.file) {
      const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "donations" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newDonation = new Donation({
      donor: req.user.userId,
      foodType,
      quantity,
      pickupAddress,
      phone,
      expiry,
      cookedTime,
      location,
      organization,
      status: "available",
      image: imageUrl,
    });

    await newDonation.save();
    res.status(201).json({
      message: "Donation created successfully",
      donation: newDonation,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating donation", error: err.message });
  }
};

// Get available donations (for receivers)
exports.getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "available" })
      .populate("donor", "name email")
      .populate("receiver", "name email"); // receiver is null here
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Claim donation (Receiver)
exports.claimDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    donation.status = "claimed";
    donation.receiver = req.user.userId; // receiver set
    await donation.save();
    await donation.populate("receiver", "name email");

    res
      .status(200)
      .json({ message: "Donation claimed successfully", donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pickup donation (Donor)
exports.pickupDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "receiver",
      "name email"
    );
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    donation.status = "pickedUp";
    await donation.save();

    res
      .status(200)
      .json({ message: "Donation picked up successfully", donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deliver donation (Donor)
exports.deliverDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "receiver",
      "name email"
    );
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    donation.status = "delivered";
    await donation.save();

    res
      .status(200)
      .json({ message: "Donation delivered successfully", donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "receiver",
      "name email"
    );
    if (!donation)
      return res.status(404).json({ message: "Donation not found" });

    // Fix: Check logged-in receiver with _id
    if (donation.receiver?._id.toString() !== req.user.userId)
      return res
        .status(403)
        .json({ message: "Not authorized to complete this donation" });

    donation.status = "completed";
    await donation.save();

    res
      .status(200)
      .json({ message: "Donation completed successfully", donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my donations (Donor)
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.userId })
      .populate("donor", "name email")
      .populate("receiver", "name email");
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my claimed donations (Receiver)
exports.getMyClaims = async (req, res) => {
  try {
    const donations = await Donation.find({ receiver: req.user.userId })
      .populate("donor", "name email")
      .populate("receiver", "name email");
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
