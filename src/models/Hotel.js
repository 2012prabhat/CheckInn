const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  amenities: [{ type: String }], // e.g., ["WiFi", "Pool", "Gym"]
  images: [{ type: String }], // URLs of hotel images
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export default mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
