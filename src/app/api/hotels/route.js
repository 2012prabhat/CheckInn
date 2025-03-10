import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hotel from "@/models/Hotel";

export async function GET() {
  await connectDB();
  const hotels = await Hotel.find();
  return NextResponse.json(hotels);
}
