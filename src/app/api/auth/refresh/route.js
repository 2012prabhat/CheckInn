import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify Refresh Token
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Generate new Access Token
    const newAccessToken = jwt.sign(
      { userId: user.userId, email: user.email, role:user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TIME }
    );
 
    const response = NextResponse.json({ message: "Token refreshed",accessToken:newAccessToken });

    // Set new access token in cookies
    response.cookies.set("accessToken", newAccessToken, { 
      httpOnly: true, 
      secure: true, 
      maxAge: 900 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message || "Error refreshing token" }, { status: 500 });
  }
}
