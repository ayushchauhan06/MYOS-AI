import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Meta Webhook handshake/verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WA_VERIFY_TOKEN || "your-custom-verify-token";

  if (mode === "subscribe" && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// POST: receive message payloads and delivery updates from Meta
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    if (!change) {
      return NextResponse.json({ ok: true });
    }

    // 1. Process Status Updates (sent, delivered, read, failed)
    const statuses = change.statuses || [];
    for (const status of statuses) {
      const waMessageId = status.id;
      const msgStatus = status.status; // delivered | read | failed

      const existingMsg = await db.whatsAppMessage.findFirst({
        where: { waMessageId },
      });

      if (existingMsg) {
        await db.whatsAppMessage.update({
          where: { id: existingMsg.id },
          data: {
            status: msgStatus,
            ...(msgStatus === "delivered" && { deliveredAt: new Date() }),
            ...(msgStatus === "read" && { readAt: new Date() }),
          },
        });
      }
    }

    // 2. Process Incoming Messages (customer replies)
    const messages = change.messages || [];
    for (const msg of messages) {
      if (msg.type === "text") {
        const from = msg.from; // Phone number of the sender
        const textBody = msg.text?.body;

        // Try to find a matching lead by whatsapp or phone number
        // Meta formats phone numbers as digits only with country code (e.g. 14155550192)
        const lead = await db.lead.findFirst({
          where: {
            OR: [
              { whatsapp: { contains: from } },
              { phone: { contains: from } },
            ],
          },
        });

        if (lead) {
          // Log the reply message
          await db.whatsAppMessage.create({
            data: {
              leadId: lead.id,
              to: from,
              message: textBody,
              status: "replied",
              waMessageId: msg.id,
              sentAt: new Date(),
            },
          });

          // Update lead stage to REPLIED
          await db.lead.update({
            where: { id: lead.id },
            data: {
              stage: "REPLIED",
            },
          });

          // Log activity timeline
          await db.activity.create({
            data: {
              leadId: lead.id,
              type: "reply_received",
              description: `WhatsApp reply received: "${textBody.substring(0, 60)}${textBody.length > 60 ? "..." : ""}"`,
              metadata: { waMessageId: msg.id, from },
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error in WhatsApp Webhook handler:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
