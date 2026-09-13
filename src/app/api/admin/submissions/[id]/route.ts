import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('bws_admin_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'ADMIN') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAuth();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const submission = await prisma.projectSubmission.update({
      where: { id },
      data: { status },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id as string,
        action: 'UPDATE_SUBMISSION_STATUS',
        details: JSON.stringify({ submissionId: id, newStatus: status })
      }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAuth();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    
    await prisma.projectSubmission.delete({
      where: { id },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id as string,
        action: 'DELETE_SUBMISSION',
        details: JSON.stringify({ submissionId: id })
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
