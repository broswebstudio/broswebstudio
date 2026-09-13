import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bws_admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;

    if (!email) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Get the user details
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true, email: true, phone: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all their project submissions by matching contactEmail
    // Note: this links the ghost tracked submissions to their newly created profile!
    const submissions = await prisma.projectSubmission.findMany({
      where: { contactEmail: email },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, user, submissions });
  } catch (error) {
    console.error('User data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
