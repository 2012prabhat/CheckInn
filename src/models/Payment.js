const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentMethod: { type: String, required: true }, // e.g., "Credit Card", "PayPal"
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  transactionId: { type: String }, // Unique ID from payment gateway
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment ||  mongoose.model("Payment", paymentSchema);
