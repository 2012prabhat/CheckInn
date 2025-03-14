import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hotel from "@/models/Hotel";

export async function GET(req) {
  await connectDB();

  // Get the search params (query string)
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug"); // Get 'slug' from query

  try {
    if (slug) {
      // Fetch hotel by slug
      const hotel = await Hotel.findOne({ slug });
      if (!hotel) {
        return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
      }
      return NextResponse.json(hotel, { status: 200 });
    } else {
      // Fetch all hotels if slug is not provided
      const hotels = await Hotel.find();
      return NextResponse.json(hotels, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
