import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Optional Svix signature check can be done here if RESEND_WEBHOOK_SECRET is set
    // For MVP simplicity and robust deployment, we handle the payload parsing
    const { type, data } = payload;
    if (!data || !data.email_id) {
      return NextResponse.json({ success: false, error: "Invalid webhook payload structure" }, { status: 400 });
    }

    const resendId = data.email_id;

    // Find email record matching the Resend ID
    const emailRecord = await db.email.findFirst({
      where: { resendId },
    });

    if (!emailRecord) {
      return NextResponse.json({ success: true, message: "Email record not found in system, skipping" });
    }

    const now = new Date();

    switch (type) {
      case "email.opened":
        await db.email.update({
          where: { id: emailRecord.id },
          data: { status: "OPENED", openedAt: now },
        });
        if (emailRecord.leadId) {
          await db.activity.create({
            data: {
              leadId: emailRecord.leadId,
              type: "email_opened",
              description: `Email opened: "${emailRecord.subject}"`,
              metadata: { resendId, event: type },
            },
          });
        }
        break;

      case "email.clicked":
        await db.email.update({
          where: { id: emailRecord.id },
          data: { status: "CLICKED", clickedAt: now },
        });
        if (emailRecord.leadId) {
          await db.activity.create({
            data: {
              leadId: emailRecord.leadId,
              type: "link_clicked",
              description: `Link clicked in email: "${emailRecord.subject}"`,
              metadata: { resendId, event: type },
            },
          });
        }
        break;

      case "email.bounced":
        await db.email.update({
          where: { id: emailRecord.id },
          data: { status: "FAILED", bouncedAt: now },
        });
        // Set lead back to NEW or custom state if bounced
        if (emailRecord.leadId) {
          await db.lead.update({
            where: { id: emailRecord.leadId },
            data: { stage: "LOST" },
          });
          await db.activity.create({
            data: {
              leadId: emailRecord.leadId,
              type: "delivery_failed",
              description: `Email bounced: "${emailRecord.subject}"`,
              metadata: { resendId, event: type },
            },
          });
        }
        break;

      case "email.delivered":
        await db.email.update({
          where: { id: emailRecord.id },
          data: { status: "DELIVERED" },
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error in Resend Webhook handler:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
