import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { ResendProvider } from "@/lib/email/resend.provider";
import { OpenAIProvider } from "@/lib/ai/openai.provider";
import { PROMPTS } from "@/lib/ai/prompts";

const resendProvider = new ResendProvider();

export const processCampaign = inngest.createFunction(
  { id: "process-campaign", name: "Process Campaign", triggers: [{ event: "campaign/start" }] },
  async ({ event, step }) => {
    const { campaignId, workspaceId } = event.data;

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
      if (!cmp) {
        throw new Error(`Campaign with ID ${campaignId} not found`);
      }
      return cmp;
    });

    // Update campaign status to ACTIVE
    await step.run("start-campaign", async () => {
      await db.campaign.update({
        where: { id: campaignId },
        data: {
          status: "ACTIVE",
          startedAt: new Date(),
        },
      });
    });

    // Process each lead in the campaign
    for (const campaignLead of campaign.leads) {
      const lead = campaignLead.lead;
      if (lead.isArchived || lead.stage === "REPLIED" || lead.stage === "WON" || lead.stage === "LOST") {
        continue;
      }

      // Step 1: Wait to throttle sends (rate limiting / avoid spam flags)
      await step.sleep("rate-limit-delay", "5s");

      // Step 2: Generate personalized outreach email using AI
      const emailContent = await step.run(`generate-email-${lead.id}`, async () => {
        const settings = await db.settings.findUnique({
          where: { workspaceId },
        });

        // Use custom API Key if available, or default process.env
        const apiKey = settings?.customApiKey || undefined;
        const model = settings?.aiModel || "gpt-4o";

        const leadDataStr = JSON.stringify({
          company: lead.company,
          contactName: lead.contactName || "there",
          painPoints: lead.painPoints,
          industry: lead.industry || "B2B",
          website: lead.website || "",
        });

        const prompt = PROMPTS.EMAIL_WRITER
          .replace("{leadData}", leadDataStr)
          .replace("{service}", settings?.leadFinderPrompt || "Sales Automation and AI Lead Generation Services")
          .replace("{tone}", settings?.emailTone || "professional");

        // We call OpenAI directly using the client wrapper helper
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
        return {
          subject: parsed.subject || `Outreach for ${lead.company}`,
          body: parsed.body || "",
        };
      });

      // Step 3: Deliver the email using Resend
      await step.run(`send-email-${lead.id}`, async () => {
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

        if (!mailInput.to) {
          return { status: "skipped", error: "Lead email is missing" };
        }

        const res = await resendProvider.sendEmail(mailInput, mailConfig);

        if (res.status === "success") {
          // Log email to DB
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

          // Update lead pipeline stage to EMAIL_SENT
          await db.lead.update({
            where: { id: lead.id },
            data: { stage: "EMAIL_SENT" },
          });

          // Log activity
          await db.activity.create({
            data: {
              leadId: lead.id,
              type: "email_sent",
              description: `Campaign email sent to ${lead.email}`,
              metadata: { resendId: res.id, campaignId },
            },
          });
        }

        return res;
      });
    }

    // Update campaign status to COMPLETED
    await step.run("complete-campaign", async () => {
      await db.campaign.update({
        where: { id: campaignId },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    });
  }
);
