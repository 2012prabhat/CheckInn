import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import { applyPagination } from "@/lib/apiFeatures";
import Hotel from "@/models/Hotel";

export const GET = async (req) => {
  try {
    await connectDB();

    const userHeader = req.headers.get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Apply pagination using the common function
    const { data: bookings, pagination } = await applyPagination(
      Booking,
      { userId: user._id },
      page,
      limit,
      { path: "hotel", select: "name images" }
    );

    return NextResponse.json({
      success: true,
      bookings,
      pagination,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Failed to fetch bookings" }, { status: 500 });
  }
};
