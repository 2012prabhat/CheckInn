import  connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();
    const { token, newPassword, confirmPassword } = await req.json();

    // Validate input
    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    // Enforce password strength
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return NextResponse.json({ 
        message: "Password must be at least 8 characters and include a number" 
      }, { status: 400 });
    }

    // Find user by reset token and check if it's still valid
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and remove reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
