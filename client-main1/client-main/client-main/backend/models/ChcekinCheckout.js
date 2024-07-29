const mongoose = require("mongoose");

const checkinCheckoutSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    checkinTime: {
      type: Date,
      default: Date.now,
    },
    checkoutTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["checked-in", "checked-out"],
      default: "checked-in",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckinCheckout", checkinCheckoutSchema);
