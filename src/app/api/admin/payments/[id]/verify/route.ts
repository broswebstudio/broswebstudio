import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bws_admin_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const paymentId = (await params).id;
    const body = await req.json();
    const { action } = body; // "ACCEPT" or "REJECT"

    // @ts-ignore
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    if (action === 'ACCEPT') {
      await prisma.$transaction(async (tx) => {
        // Update payment
        // @ts-ignore
        await tx.payment.update({
          where: { id: paymentId },
          data: { status: 'ACCEPTED' }
        });
        
        // Update invoice
        // @ts-ignore
        await tx.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'PAYMENT_ACCEPTED' }
        });

        // Generate receipt
        // @ts-ignore
        const receiptCount = await tx.receipt.count();
        const year = new Date().getFullYear();
        const recNum = `REC-${year}-${String(receiptCount + 1).padStart(4, '0')}`;

        // @ts-ignore
        await tx.receipt.create({
          data: {
            receiptNumber: recNum,
            invoiceId: payment.invoiceId,
            amountReceived: payment.amount,
            method: payment.method,
            utrNumber: payment.utrNumber,
            paymentDate: payment.paymentDate,
            verifiedDate: new Date()
          }
        });
      });
    } else if (action === 'REJECT') {
      await prisma.$transaction([
        // @ts-ignore
        prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'REJECTED' }
        }),
        // @ts-ignore
        prisma.invoice.update({
          where: { id: payment.invoiceId },
          data: { status: 'REJECTED' }
        })
      ]);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId: payload.id as string,
        action: action === 'ACCEPT' ? 'VERIFY_PAYMENT_ACCEPT' : 'VERIFY_PAYMENT_REJECT',
        details: JSON.stringify({ paymentId })
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin payment verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
