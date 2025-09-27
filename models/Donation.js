const mongoose = require("mongoose");

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
    status: {
      type: String,
      enum: [
        "available",
        "claimed",
        "pickedUp",
        "delivered",
        "completed",
        "expired",
      ], // ✅ updated
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
