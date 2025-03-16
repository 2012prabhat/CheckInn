import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import fs from "fs/promises";
import path from "path";

// Ensure the 'uploads' directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
await fs.mkdir(uploadDir, { recursive: true });

export async function POST(req) {
    await connectDB();

    const userHeader = req.headers.get("x-user");
    const user = userHeader ? JSON.parse(userHeader) : null;
    if (!user || !user.userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = user.userId;

    try {
        const formData = await req.formData();
        const file = formData.get("profileImage");

        if (!file || typeof file === "string") {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        // Read file data
        const fileBuffer = await file.arrayBuffer();
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file to disk
        await fs.writeFile(filePath, Buffer.from(fileBuffer));

        // Save to database
        const imagePath = `/uploads/${fileName}`;
        await User.findByIdAndUpdate(userId, { profileImg: imagePath });

        return NextResponse.json({ profileImg: imagePath }, { status: 200 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ message: "Upload failed" }, { status: 500 });
    }
}
