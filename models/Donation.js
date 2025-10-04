const mongoose = require("mongoose");

// models/Donation.js
const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    foodType: { type: String, required: true },
    quantity: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    phone: { type: String, required: true },
    expiry: { type: Date, required: true },
    cookedTime: { type: Date, required: true },
    location: { type: String, required: true },
    organization: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "available",
        "claimed",
        "pickedUp",
        "delivered",
        "completed",
        "expired",
      ],
      default: "available",
    },
    image: { type: String }, // <-- new field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
