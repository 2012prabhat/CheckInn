import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Review from "@/models/Review";

export async function PATCH(req, { params }) {
  await connectDB();

  const { id } = params; // Extract review ID from slug
  const { rating, comment } = await req.json();

  if (!rating && !comment) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  try {
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    // Update fields if provided
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    return NextResponse.json({ message: "Review updated successfully", review }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating review" }, { status: 500 });
  }
}
