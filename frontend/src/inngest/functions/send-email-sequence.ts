import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { ResendProvider } from "@/lib/email/resend.provider";
import { OpenAIProvider } from "@/lib/ai/openai.provider";
import { PROMPTS } from "@/lib/ai/prompts";

const resendProvider = new ResendProvider();

export const sendEmailSequence = inngest.createFunction(
  { id: "send-email-sequence", name: "Send Email Sequence", triggers: [{ event: "campaign/send-followup" }] },
  async ({ event, step }) => {
    const { campaignId, workspaceId, stepNumber } = event.data;

    const campaign = await step.run("fetch-campaign", async () => {
      const cmp = await db.campaign.findUnique({
        where: { id: campaignId },
        include: {
          leads: {
            include: {
              lead: true,
            },
          },
        },
      });
      if (!cmp) throw new Error(`Campaign ${campaignId} not found`);
      return cmp;
    });

    for (const campaignLead of campaign.leads) {
      const lead = campaignLead.lead;

      // Only follow up if they have NOT replied, and are not won/lost
      if (lead.stage === "REPLIED" || lead.stage === "WON" || lead.stage === "LOST" || lead.isArchived) {
        continue;
      }

      await step.sleep("rate-limit-delay", "5s");

      // Generate follow-up email content using AI prompts
      const emailContent = await step.run(`generate-followup-${lead.id}-step-${stepNumber}`, async () => {
        const settings = await db.settings.findUnique({
          where: { workspaceId },
        });

        const apiKey = settings?.customApiKey || undefined;
        const model = settings?.aiModel || "gpt-4o";

        const leadDataStr = JSON.stringify({
          company: lead.company,
          contactName: lead.contactName || "there",
          painPoints: lead.painPoints,
        });

        const prompt = PROMPTS.EMAIL_WRITER
          .replace("{leadData}", leadDataStr)
          .replace("{service}", settings?.leadFinderPrompt || "Sales Automation Services")
          .replace("{tone}", settings?.emailTone || "professional");

        const clientOpenAI = new OpenAIProvider();
        const openAIClient = (clientOpenAI as any).getClient(apiKey);
        const response = await openAIClient.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: settings?.temperature || 0.7,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("AI returned empty body");
        const parsed = JSON.parse(content);

        // Return followUp1, followUp2, or followUp3 depending on stepNumber
        let body = parsed.followUp1 || "";
        if (stepNumber === 2) body = parsed.followUp2 || "";
        if (stepNumber === 3) body = parsed.followUp3 || "";

        return {
          subject: `Re: ${parsed.subject || `Outreach for ${lead.company}`}`,
          body: body || parsed.body || "",
        };
      });

      if (!emailContent.body) continue;

      // Send via Resend
      await step.run(`send-followup-email-${lead.id}-step-${stepNumber}`, async () => {
        const settings = await db.settings.findUnique({
          where: { workspaceId },
        });

        const mailInput = {
          to: lead.email || "",
          subject: emailContent.subject,
          body: emailContent.body,
        };

        const mailConfig = {
          apiKey: settings?.customApiKey || undefined,
          fromEmail: settings?.emailFromAddress || undefined,
          fromName: settings?.emailFromName || undefined,
        };

        if (!mailInput.to) return;

        const res = await resendProvider.sendEmail(mailInput, mailConfig);

        if (res.status === "success") {
          await db.email.create({
            data: {
              workspaceId,
              leadId: lead.id,
              campaignId,
              to: mailInput.to,
              subject: mailInput.subject,
              body: mailInput.body,
              status: "SENT",
              resendId: res.id,
              sentAt: new Date(),
            },
          });

          await db.activity.create({
            data: {
              leadId: lead.id,
              type: "email_sent",
              description: `Follow-up email (Step ${stepNumber}) sent to ${lead.email}`,
              metadata: { resendId: res.id, campaignId, stepNumber },
            },
          });
        }
      });
    }
  }
);
