import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hotel from "@/models/Hotel";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json(); // Read body from request
    const lat = parseFloat(body.lat);
    const lng = parseFloat(body.lng);
    const radius = parseFloat(body.radius) || 10; // Default 10km

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude & Longitude required" }, { status: 400 });
    }

    const hotels = await Hotel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    });

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", message: error.message }, { status: 500 });
  }
}

  