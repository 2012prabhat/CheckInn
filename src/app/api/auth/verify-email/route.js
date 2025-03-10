import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectDB();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const { name, email, password, role, team } = decoded;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already verified" }, { status: 400 });
    }
    
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password, role, resetToken:null, resetTokenExpiry:null,team });
    await newUser.save();

    return NextResponse.json({ message: "Email verified. You can now log in." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
