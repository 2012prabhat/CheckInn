import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User model se connected rahega
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // 1 to 5 rating system
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Ek hi user ek hotel/room pe multiple baar review na de
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true });
reviewSchema.index({ user: 1, room: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
