import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, servicesSelected, totalEstimate, status, contactName, contactEmail, contactPhone, message, honeypot } = body;

    if (honeypot) {
      console.warn('Bot blocked by honeypot field');
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    if (!sessionId || !servicesSelected || typeof totalEstimate !== 'number') {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (contactName && contactName.length > 100) return NextResponse.json({ error: "Name too long" }, { status: 400 });
    if (contactEmail && contactEmail.length > 150) return NextResponse.json({ error: "Email too long" }, { status: 400 });
    if (message && message.length > 2000) return NextResponse.json({ error: "Message too long" }, { status: 400 });
    
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get('bws_admin_token')?.value;
    let userId = null;

    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.email) {
          const user = await prisma.user.findUnique({ where: { email: payload.email as string } });
          if (user) userId = user.id;
        }
      } catch (err) {
        console.warn('Invalid token during submission');
      }
    }

    // We use a transaction if we are generating an invoice, otherwise just create submission
    let submissionId = null;

    if (userId && totalEstimate > 0) {
      // Create project and invoice together
      const result = await prisma.$transaction(async (tx) => {
        const sub = await tx.projectSubmission.create({
          data: {
            sessionId,
            userId,
            servicesSelected: JSON.stringify(servicesSelected),
            totalEstimate,
            status: status || "NEW",
            contactName,
            contactEmail,
            contactPhone,
            message,
          } as any,
        });

        // Generate Invoice Number (e.g. BWS-2026-0001)
        // @ts-ignore
        const invoiceCount = await tx.invoice.count();
        const year = new Date().getFullYear();
        const invNum = `BWS-${year}-${String(invoiceCount + 1).padStart(4, '0')}`;

        // Create Due Date (7 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        // @ts-ignore
        await tx.invoice.create({
          data: {
            invoiceNumber: invNum,
            userId: userId as string,
            projectId: sub.id,
            amount: totalEstimate,
            dueDate: dueDate
          }
        });

        return sub;
      });
      
      submissionId = result.id;
      
    } else {
      const submission = await prisma.projectSubmission.create({
        data: {
          sessionId,
          userId,
          servicesSelected: JSON.stringify(servicesSelected),
          totalEstimate,
          status: status || "NEW",
          contactName,
          contactEmail,
          contactPhone,
          message,
        } as any,
      });
      submissionId = submission.id;
    }

    // Dispatch notifications asynchronously
    import('@/lib/mailer').then(({ sendSubmissionEmail }) => {
      sendSubmissionEmail({
        id: submissionId,
        servicesSelected: servicesSelected, 
        contactName, contactEmail, contactPhone, message, totalEstimate
      }).catch(console.error);
    });

    return NextResponse.json({ success: true, submissionId });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
