import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bws_admin_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const invoiceId = (await params).id;
    const body = await req.json();
    const { utrNumber, notes } = body;

    if (!utrNumber) return NextResponse.json({ error: 'UTR number is required' }, { status: 400 });

    // @ts-ignore
    const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });

    if (!invoice || invoice.userId !== user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status !== 'PAYMENT_PENDING') {
      return NextResponse.json({ error: 'Invoice is not in pending status' }, { status: 400 });
    }

    // Create Payment Record and Update Invoice Status inside a Transaction
    await prisma.$transaction([
      // @ts-ignore
      prisma.payment.create({
        data: {
          invoiceId,
          amount: invoice.amount,
          method: 'UNKNOWN', // could be parsed or asked in form
          utrNumber,
          notes,
          paymentDate: new Date(),
          status: 'PENDING_VERIFICATION'
        }
      }),
      // @ts-ignore
      prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'PAYMENT_SUBMITTED' }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
