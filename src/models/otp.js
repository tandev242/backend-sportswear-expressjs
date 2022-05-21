const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    generatedOtp: {
      type: String,
      required: true,
      trim: true,
    },
    expireAt: {
      type: Date,
      default: Date.now(),
      expires: 60*5  // set expire time is 5 minutes
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
