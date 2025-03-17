import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";
import sendEmail from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if an active reset token already exists
    if (user.resetToken && user.resetTokenExpiry > Date.now()) {
      return NextResponse.json({ message: "Reset link already sent. Try again later." }, { status: 400 });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes expiry

    // Save token in user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create password reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}reset-password?token=${resetToken}`;

    // Email Template
    const subject = "Password Reset Request";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <div style="text-align: center;">
          <img src=${process.env.BRAND_LOGO} alt="" style="width: 120px; margin-bottom: 10px;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #555;">Hello,</p>
          <p style="color: #555;">We received a request to reset your password for <b>${process.env.BRAND_NAME}</b>. Click the button below to set a new password.</p>
          <a href="${resetLink}" 
            style="background-color: #ff4c4c; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
            Reset Password
          </a>
          <p style="color: #555; margin-top: 20px;">If the button above does not work, copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #ff4c4c;">${resetLink}</p>
          <p style="color: #555;">This link will expire in 30 minutes.</p>
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="text-align: center; font-size: 14px; color: #777;">If you didn’t request this, please ignore this email.</p>
        <p style="text-align: center; font-size: 14px; color: #777;">Need help? Contact us at <a href="mailto:support@${process.env.BRAND_NAME}.com" style="color: #ff4c4c;">support@${process.env.BRAND_NAME}.com</a></p>
      </div>
    `;

    // Send email with reset link
    try {
      await sendEmail(user.email, subject, html);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json({ message: "Failed to send email. Try again later." }, { status: 500 });
    }

    return NextResponse.json({ message: "Password reset link sent to email" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
