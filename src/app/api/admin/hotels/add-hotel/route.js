import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db";
import Hotel from "@/models/Hotel";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export async function POST(req) {
  try {
    await connectDB(); // Ensure DB connection

    const userHeader = req.headers.get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized! Please log in." }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Access denied! Only admins can create hotels." }, { status: 403 });
    }

    // Parse form data properly
    const formData = await req.formData();
    const fields = Object.fromEntries(formData.entries());

    const { name, description, address, city, state, country, zipcode, amenities, price } = fields;

    if (!name || !description || !address || !city || !state || !country || !zipcode || !price) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Check if a hotel with the same name already exists
    const existingHotel = await Hotel.findOne({ name });
    if (existingHotel) {
      return NextResponse.json({ error: "Hotel with this name already exists" }, { status: 400 });
    }

    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "hotels");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Handle file uploads
    const files = [];
    let imageCount = 1;

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const fileExtension = path.extname(value.name);
        const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}-${imageCount}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        const buffer = await value.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));

        files.push(`/hotels/${fileName}`);
        imageCount++;
      }
    }

    // Create a new hotel entry
    const newHotel = new Hotel({
      name,
      description,
      address,
      city,
      state,
      country,
      zipcode,
      price,
      images: files,
      amenities: typeof amenities === "string" ? amenities.split(",") : [],
      owner: user?.userId,
    });

    await newHotel.save();

    return NextResponse.json({ message: "Hotel created successfully", hotel: newHotel }, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


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