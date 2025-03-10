import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";

export async function POST(req) {
  await connectDB();
  const { userId, hotelId, checkIn, checkOut } = await req.json();
  const booking = await Booking.create({ userId, hotelId, checkIn, checkOut });
  return NextResponse.json(booking);
}
