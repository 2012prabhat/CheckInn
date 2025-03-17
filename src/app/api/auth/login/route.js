import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role:user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TIME }
    );

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email, role:user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_TIME}
    );

    // ✅ Create response with Set-Cookie header

    const response = NextResponse.json({
      message: "Login successful",
      accessToken, // Send accessToken in response
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        profileImg:user.profileImg
      }
    });

    response.headers.set(
      "Set-Cookie",
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
    );

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
