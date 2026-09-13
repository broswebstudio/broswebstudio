import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';


export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
    }

    const otpRequest = await prisma.otpRequest.findUnique({ where: { email } });

    if (!otpRequest) {
      return NextResponse.json({ error: 'No OTP request found for this email' }, { status: 400 });
    }

    if (otpRequest.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date() > otpRequest.expiresAt) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // OTP matches and is valid. Verify the user.
    await prisma.user.update({
      where: { email },
      data: { isVerified: true }
    });

    // Delete the OTP request
    await prisma.otpRequest.delete({ where: { email } });

    return NextResponse.json({ success: true, message: 'Account verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
