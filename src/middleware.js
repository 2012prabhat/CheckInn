import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const method = req.method;
  const slug = url.searchParams.get('slug'); // Check if `slug` exists in query params

  // ✅ Allow public access to auth and webhook routes
  if (pathname.startsWith('/api/auth') || pathname.startsWith("/api/webhook")) {
    return NextResponse.next();
  }

  // ✅ Allow GET /api/hotels only if there's NO slug in query params
  if (pathname === '/api/hotels' && method === 'GET' && !slug) {
    return NextResponse.next();
  }

  if (pathname === '/api/hotels/near-by') {
    return NextResponse.next();
  }

  // 🔹 Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

    // 🔹 Forward the user info in the request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user', JSON.stringify(payload));

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // 🔹 Admin Restriction (Middleware doesn't modify headers for itself)
    if (pathname.startsWith("/api/admin") && payload.role !== "admin") {
      return NextResponse.json(
        { message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    return response;
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};
