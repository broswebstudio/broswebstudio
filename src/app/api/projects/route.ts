import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSubmissionEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, servicesSelected, totalEstimate, status, contactName, contactEmail, contactPhone, message } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Upsert project submission based on sessionId
    const existing = await prisma.projectSubmission.findFirst({
      where: { sessionId }
    });

    let savedProject;

    if (existing) {
      savedProject = await prisma.projectSubmission.update({
        where: { id: existing.id },
        data: {
          servicesSelected: JSON.stringify(servicesSelected),
          totalEstimate,
          status: status || existing.status,
          contactName: contactName || existing.contactName,
          contactEmail: contactEmail || existing.contactEmail,
          contactPhone: contactPhone || existing.contactPhone,
          message: message || existing.message,
        }
      });
    } else {
      savedProject = await prisma.projectSubmission.create({
        data: {
          sessionId,
          servicesSelected: JSON.stringify(servicesSelected),
          totalEstimate,
          status: status || "ABANDONED",
        }
      });
    }

    // Trigger Email if the project is actually submitted or discussed
    if (status === "SUBMITTED" || status === "DISCUSS") {
      // Send email asynchronously without blocking the response
      sendSubmissionEmail({
        ...savedProject,
        servicesSelected: servicesSelected, // Pass the unstringified version for easier parsing
      }).catch(err => console.error("Background email failed", err));
    }

    return NextResponse.json({ success: true, project: savedProject });

  } catch (error) {
    console.error("Project submission error:", error);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}
