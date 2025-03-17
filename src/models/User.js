import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  profileImg: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Role for authorization
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetToken: { type: String, default: null},  // Add this
  resetTokenExpiry: { type: Date, default: null }, // Add this
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
});

export default mongoose.models.User ||  mongoose.model("User", userSchema);