import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Booking from "@/models/Booking";

// POST function to create a new booking
export async function POST(req) {
  await dbConnect();
  try {
    // Parse the request body
    const { userId, hotelId, checkInDate, checkOutDate, totalPrice } = await req.json();

    // Validate required fields
    if (!userId || !hotelId || !checkInDate || !checkOutDate || !totalPrice) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new booking
    const newBooking = new Booking({
      userId,
      hotelId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Save the booking to the database
    await newBooking.save();

    // Return success response
    return NextResponse.json(
      { success: true, data: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}