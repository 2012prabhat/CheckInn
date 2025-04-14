import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hotel from "@/models/Hotel";

export async function PATCH(req, { params }) {
  await connectDB();

  try {
    const userHeader = req.headers.get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { slug } = params;
    const hotel = await Hotel.findOne({ slug });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description, price, location, images, amenities } = body;

    // Update hotel fields
    hotel.name = name || hotel.name;
    hotel.description = description || hotel.description;
    hotel.price = price || hotel.price;
    hotel.images = images || hotel.images;
    hotel.amenities = amenities || hotel.amenities;

    // Convert location string to GeoJSON
    if (location && typeof location === "string") {
      const [lng, lat] = location.split(",").map(coord => parseFloat(coord.trim()));
      hotel.location = {
        type: "Point",
        coordinates: [lng, lat]
      };
    }

    await hotel.save();

    return NextResponse.json({ success: true, message: "Hotel updated successfully", hotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
