import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('bws_pending_google')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No pending registration found.' }, { status: 400 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.pendingRegistration) {
      return NextResponse.json({ error: 'Invalid pending token.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      email: payload.email,
      name: payload.name,
    });
  } catch (error) {
    console.error('Pending Auth Error:', error);
    return NextResponse.json({ error: 'Session expired or invalid.' }, { status: 401 });
  }
}
