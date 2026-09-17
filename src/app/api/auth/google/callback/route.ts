import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${url.origin}/login?error=google_auth_failed`);
    }

    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.NODE_ENV === 'production'
      ? 'https://www.broswebstudio.in/api/auth/google/callback'
      : `${url.origin}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Google OAuth is not configured.' }, { status: 500 });
    }

    // 1. Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error('Google token error:', err);
      return NextResponse.redirect(`${url.origin}/login?error=google_auth_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(`${url.origin}/login?error=google_profile_failed`);
    }

    const profile = await profileResponse.json();
    const { id: googleId, email, name } = profile;

    if (!email) {
      return NextResponse.redirect(`${url.origin}/login?error=no_email_provided`);
    }

    // 3. Upsert user in database
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // User exists, just link googleId if it's not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId, isVerified: true }, // Auto verify since Google verified it
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          isVerified: true,
          // Since password is optional now, we don't need to provide it for OAuth users
        },
      });
    }

    // 4. Generate JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // 5. Set Cookie and Redirect to dashboard (or admin based on role)
    const res = NextResponse.redirect(`${url.origin}/${user.role === 'ADMIN' ? 'admin' : 'profile'}`);
    
    res.cookies.set({
      name: 'bws_admin_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Google Callback Error:', error);
    const url = new URL(req.url);
    return NextResponse.redirect(`${url.origin}/login?error=internal_server_error`);
  }
}
