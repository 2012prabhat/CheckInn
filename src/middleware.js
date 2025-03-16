import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const method = req.method;
  const slug = url.searchParams.get('slug'); // Check if `slug` exists in query params

  console.log("Middleware triggered:", { pathname, method, slug });

  // ✅ Allow public access to auth and webhook routes
  if (pathname.startsWith('/api/auth') || pathname.startsWith("/api/webhook")) {
    console.log("✅ Allowing public route:", pathname);
    return NextResponse.next();
  }

  // ✅ Allow GET /api/hotels only if there's NO slug in query params
  if (pathname === '/api/hotels' && method === 'GET' && !slug) {
    console.log("✅ Allowing public GET request to /api/hotels (without slug)");
    return NextResponse.next();
  }

  // 🔹 Restrict all other API routes, including GET /api/hotels?slug=...
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ Unauthorized: No token found");
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 🔹 Verify the token using jose
    const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 🔹 Attach user to request headers
    const headers = new Headers(req.headers);
    headers.set('x-user', JSON.stringify(payload));

    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};
