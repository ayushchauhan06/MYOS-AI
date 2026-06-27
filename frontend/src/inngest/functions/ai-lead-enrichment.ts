import { inngest } from "@/inngest/client";
import { db } from "@/lib/db";
import { OpenAIProvider } from "@/lib/ai/openai.provider";

const aiProvider = new OpenAIProvider();

export const aiLeadEnrichment = inngest.createFunction(
  { id: "ai-lead-enrichment", name: "AI Lead Enrichment", triggers: [{ event: "lead/created" }] },
  async ({ event, step }) => {
    const { leadId, workspaceId } = event.data;

    const lead = await step.run("fetch-lead", async () => {
      const l = await db.lead.findUnique({
        where: { id: leadId },
      });
      if (!l) throw new Error(`Lead ${leadId} not found`);
      return l;
    });

    const enrichment = await step.run("enrich-with-ai", async () => {
      const settings = await db.settings.findUnique({
        where: { workspaceId },
      });

      const apiKey = settings?.customApiKey || undefined;
      const model = settings?.aiModel || "gpt-4o";

      return aiProvider.analyzeLead(
        lead.company,
        lead.website || undefined,
        lead.industry || undefined,
        apiKey,
        model
      );
    });

    // Update lead in DB with enriched values
    await step.run("update-lead-db", async () => {
      await db.lead.update({
        where: { id: leadId },
        data: {
          painPoints: enrichment.painPoints,
          outreachAngle: enrichment.outreachAngle,
          estimatedValue: enrichment.estimatedValue,
          leadScore: enrichment.leadScore,
          aiConfidence: enrichment.aiConfidence,
          icebreaker: enrichment.icebreaker,
        },
      });

      // Log activity
      await db.activity.create({
        data: {
          leadId,
          type: "lead_updated",
          description: "Lead enriched with AI intelligence",
          metadata: { enriched: true },
        },
      });
    });
  }
);
