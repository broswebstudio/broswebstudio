import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

// Simple in-memory store for rate limiting
// Note: In serverless environments (Vercel), this resets on cold starts.
// For production, consider using Upstash Redis or Vercel KV.
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10; // 10 requests per minute

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  record.count += 1;
  return true;
}

export async function middleware(request: NextRequest) {
  // Apply rate limiting to sensitive APIs
  if (request.nextUrl.pathname.startsWith('/api/submit') || request.nextUrl.pathname.startsWith('/api/auth/login')) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests, please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Protect /admin and /profile paths
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/profile')) {
    const token = request.cookies.get('bws_admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // RBAC Check for Admin route
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (payload.role !== 'ADMIN') {
          // Normal users trying to access admin get sent to their profile
          return NextResponse.redirect(new URL('/profile', request.url));
        }
      }
      
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/api/submit', '/api/auth/login'],
};
