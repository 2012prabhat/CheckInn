import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import sendEmail from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, confirmPassword, role, phone } = await req.json();

    if (!name || !email || !password || !confirmPassword || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    
    const verificationToken = jwt.sign({ name, email, password, role }, process.env.EMAIL_VERIFICATION_SECRET, {
      expiresIn: "15m",
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;

    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
    <div style="text-align: center;">
      <img src=${process.env.BRAND_LOGO} alt="logo" style="width: 120px; margin-bottom: 10px;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p style="color: #555;">Hello, ${name}</p>
      <p style="color: #555;">Thank you for registering with <b>${process.env.BRAND_NAME}</b>. Please verify your email to complete your registration.</p>
      <a href="${verificationLink}" 
         style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
        Verify Email
      </a>
      <p style="color: #555; margin-top: 20px;">If the button above does not work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
    </div>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    <p style="text-align: center; font-size: 14px; color: #777;">If you didn't request this, please ignore this email.</p>
    <p style="text-align: center; font-size: 14px; color: #777;">Need help? Contact us at <a href="mailto:support@${process.env.BRAND_NAME}.com" style="color: #007bff;">support@${process.env.BRAND_NAME}.com</a></p>
  </div>
`;

    const subject = "Verify your email"
    const emailResp = await sendEmail(email, subject, html);
    console.log("this is email resp",emailResp)

    if(emailResp.success === false){
      return NextResponse.json({
        message: "Verification email sent failed.",
      });
    }

    return NextResponse.json({
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


