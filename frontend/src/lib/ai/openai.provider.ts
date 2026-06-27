import OpenAI from "openai";
import {
  AIProvider,
  GenerateProposalInput,
  GenerateProposalOutput,
  LeadAnalysisOutput,
} from "./ai.provider";
import { PROMPTS } from "./prompts";

export class OpenAIProvider implements AIProvider {
  private getClient(apiKey?: string): OpenAI {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error("OpenAI API Key is missing. Please set it in Settings or environment variables.");
    }
    return new OpenAI({ apiKey: key });
  }

  async generateProposal(
    input: GenerateProposalInput,
    apiKey?: string,
    model: string = "gpt-4o",
    temperature: number = 0.7
  ): Promise<GenerateProposalOutput> {
    const client = this.getClient(apiKey);

    const prompt = PROMPTS.PROPOSAL_GENERATOR
      .replace("{leadData}", JSON.stringify({ companyName: input.companyName }))
      .replace("{projectType}", input.projectType)
      .replace("{budget}", input.budget || "Not specified")
      .replace("{timeline}", input.timeline || "Not specified")
      .replace("{requirements}", input.requirements);

    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: temperature,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    const parsed = JSON.parse(content);
    
    // Structure the proposal into sections for standard frontend rendering
    const introduction = parsed.introduction || "";
    const problemAnalysis = parsed.problemAnalysis || "";
    const proposedSolution = parsed.proposedSolution || "";
    const scopeOfWork = Array.isArray(parsed.scopeOfWork) ? parsed.scopeOfWork.join("\n") : "";
    const deliverables = Array.isArray(parsed.deliverables) ? parsed.deliverables.join("\n") : "";
    
    const sections = [
      { title: "Introduction", content: introduction },
      { title: "Problem Analysis", content: problemAnalysis },
      { title: "Proposed Solution", content: proposedSolution },
      { title: "Scope of Work", content: scopeOfWork },
      { title: "Deliverables", content: deliverables },
    ];

    return {
      title: parsed.title || `${input.companyName} Proposal`,
      sections,
    };
  }

  async analyzeLead(
    companyName: string,
    websiteUrl?: string,
    industry?: string,
    apiKey?: string,
    model: string = "gpt-4o"
  ): Promise<LeadAnalysisOutput> {
    const client = this.getClient(apiKey);

    const criteria = {
      companyName,
      websiteUrl: websiteUrl || "Not specified",
      industry: industry || "Not specified",
    };

    const prompt = PROMPTS.LEAD_FINDER
      .replace("{criteria}", JSON.stringify(criteria))
      .replace("{count}", "1");

    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    // The prompt expects either a JSON array or a JSON object with leads/lead
    const parsed = JSON.parse(content);
    const lead = Array.isArray(parsed) ? parsed[0] : (parsed.leads?.[0] || parsed);

    return {
      painPoints: Array.isArray(lead.painPoints) ? lead.painPoints : [],
      outreachAngle: lead.outreachAngle || "Outbound outreach recommendation",
      estimatedValue: lead.estimatedValue || "$5,000 – $10,000",
      leadScore: typeof lead.leadScore === "number" ? lead.leadScore : 70,
      aiConfidence: typeof lead.aiConfidence === "number" ? lead.aiConfidence : 75,
      icebreaker: lead.icebreaker || `Hi ${companyName} team, I noticed your work and would love to connect.`,
    };
  }
}
