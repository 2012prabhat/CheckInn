// app/api/bookings/details/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

export async function GET(request) {
  await connectDB();

  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    // Find the booking using the Stripe session ID
    const booking = await Booking.findOne({ stripeSessionId: sessionId }).populate("hotel");

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // Return the booking details
    return NextResponse.json(booking, { status: 200 });
  } catch (err) {
    console.error("Error fetching booking details:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}