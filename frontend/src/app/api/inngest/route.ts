import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processCampaign } from "@/inngest/functions/process-campaign";
import { sendEmailSequence } from "@/inngest/functions/send-email-sequence";
import { aiLeadEnrichment } from "@/inngest/functions/ai-lead-enrichment";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processCampaign,
    sendEmailSequence,
    aiLeadEnrichment,
  ],
});
