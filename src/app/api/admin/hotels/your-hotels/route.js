import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hotel from "@/models/Hotel";

export const GET = async (req) => {
  try {
    await connectDB();

    // Get the logged-in admin
    const userHeader = req.headers.get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;

    if (!user || !user.userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Fetch hotels owned by the admin
    const hotels = await Hotel.find({ owner: user.userId });

    return NextResponse.json({
      success: true,
      data: hotels,
      message: hotels.length ? "Hotels fetched successfully" : "No hotels found",
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch hotels" }, { status: 500 });
  }
};
