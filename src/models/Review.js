import mongoose from "mongoose";
import User from "./User"; // Ensure User model is imported

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This must match the model name
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, hotel: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
