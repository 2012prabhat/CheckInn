import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuid()}-${file.name}`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filePath, buffer);

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url });
}
