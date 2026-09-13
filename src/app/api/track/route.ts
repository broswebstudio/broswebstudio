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
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to track activity" }, { status: 500 });
  }
}
