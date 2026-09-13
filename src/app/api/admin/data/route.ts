import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bws_admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const submissions = await prisma.projectSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const activityLogs = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 1000 // Limit to last 1000 logs
    });

    return NextResponse.json({
      success: true,
      submissions,
      activityLogs
    });
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}
