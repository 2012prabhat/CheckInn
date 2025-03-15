import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const method = req.method;

  // ✅ Publicly allow GET requests for /api/hotels
  if (pathname.startsWith("/api/webhook")) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api/hotels') && method === 'GET') {
    console.log("✅ Allowing public GET request to /api/hotels");
    return NextResponse.next();
  }

  // ✅ Allow authentication routes
  if (pathname.startsWith('/api/auth')) {
    console.log("✅ Allowing public auth route");
    return NextResponse.next();
  }

  // 🔹 Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("❌ Unauthorized: No token found");
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 🔹 Verify the token using jose
    const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);

    console.log("✅ Token verified for user:", payload);

    // 🔹 Attach user to request headers
    const headers = new Headers(req.headers);
    headers.set('x-user', JSON.stringify(payload));

    return NextResponse.next({ request: { headers } });
  } catch (err) {
    console.log("❌ Invalid Token:", err);
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};
