import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, actionType, path, details } = body;

    if (!sessionId || !actionType || !path) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const log = await prisma.activityLog.create({
      data: {
        sessionId,
        actionType,
        path,
        details: JSON.stringify(details || {}),
      },
    });

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error: any) {
    console.error("Tracking error:", error);
    // Don't break the client or return generic 500 if JSON fails
    return NextResponse.json({ error: "Failed to track activity", details: error?.message }, { status: 500 });
  }
}
