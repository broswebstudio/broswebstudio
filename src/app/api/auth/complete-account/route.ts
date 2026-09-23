import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('bws_pending_google')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No pending registration found.' }, { status: 400 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.pendingRegistration || !payload.email || !payload.googleId) {
      return NextResponse.json({ error: 'Invalid pending token.' }, { status: 400 });
    }

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    // Check if user already got created in another session to prevent duplicates
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: payload.email as string },
          { googleId: payload.googleId as string }
        ]
      }
    });

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            email: payload.email as string,
            name: payload.name as string,
            googleId: payload.googleId as string,
            phone: phone,
            isVerified: true,
            role: 'USER',
          },
        });
      } catch (error: any) {
        if (error.code === 'P2002') {
          // A concurrent request just created this user. Let's fetch them.
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: payload.email as string },
                { googleId: payload.googleId as string }
              ]
            }
          });
          if (!user) throw error;
        } else {
          throw error;
        }
      }
    }

    // Generate real JWT
    const realToken = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    const res = NextResponse.json({ success: true, role: user.role });
    
    // Set real auth cookie
    res.cookies.set({
      name: 'bws_admin_token',
      value: realToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear pending cookie
    res.cookies.delete('bws_pending_google');

    return res;
  } catch (error) {
    console.error('Complete Account Error:', error);
    return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 });
  }
}
