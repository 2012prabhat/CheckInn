import connectDB from "@/lib/db";
import Review from "@/models/Review";
import Hotel from "@/models/Hotel";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB();
  
    // Get hotelId from query params
    const { searchParams } = new URL(req.url);
    const hotel = searchParams.get("hotel");
  
    if (!hotel) {
      return NextResponse.json({ message: "hotelId is required" }, { status: 400 });
    }
  
    try {
      const reviews = await Review.find({ hotel: hotel }).populate("user", "name email");
  
      return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error fetching reviews" }, { status: 500 });
    }
  }
export async function POST(req) {
  try {
    await connectDB();

    // Extract user from request headers
    const userHeader = req.headers.get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { hotelId, rating, comment } = await req.json();

    if (!hotelId || !rating || rating < 1 || rating > 5) {
      return Response.json({ message: "Invalid review data" }, { status: 400 });
    }

    // Check if the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return Response.json({ message: "Hotel not found" }, { status: 404 });
    }

    // Create and save the review
    const review = new Review({
      user: user.userId,
      hotel: hotelId,
      rating,
      comment,
    });

    await review.save();

    return Response.json(
      { message: "Review submitted successfully", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review Submission Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
