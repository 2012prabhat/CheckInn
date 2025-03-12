// middleware/authMiddleware.js
import { NextResponse } from 'next/server'; // Correct import
import { jwtVerify } from 'jose';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Exclude certain paths from authentication
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/hotels')) {
    return NextResponse.next();
  }

  // Get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Clone the request headers and add the user data
    const headers = new Headers(req.headers);
    headers.set('x-user', JSON.stringify(payload));

    // Return a new response with the updated headers
    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: 'Invalid token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: '/api/:path*', // Apply middleware to all API routes
};