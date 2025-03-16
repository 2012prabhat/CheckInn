import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful" });

    // Clear refreshToken cookie by setting Max-Age=0
    response.headers.set(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/"
    );

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
