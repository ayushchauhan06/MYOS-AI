import { LeadProvider, LeadSearchQuery, LeadSearchResponse } from "../leads/lead-provider.interface";
import { CreateLeadInput } from "@/modules/leads/lead.types";
import { LeadStage, LeadSource } from "@prisma/client";

const APIFY_BASE_URL = "https://api.apify.com/v2";
const ACTOR_ID = "compass~crawler-google-places";

/** Maximum time we wait for an Apify run to finish (ms) */
const MAX_WAIT_MS = 90_000;
/** Polling interval between status checks (ms) */
const POLL_INTERVAL_MS = 3_000;

export class ApifyLeadProvider implements LeadProvider {
  async searchLeads(query: LeadSearchQuery): Promise<LeadSearchResponse> {
    const token = process.env.APIFY_TOKEN;

    if (!token || token.trim() === "" || token.includes("replace-me")) {
      console.log("[Apify] Token not found — using mock data.");
      return this.searchLeadsMock(query);
    }

    try {
      return await this.searchLeadsReal(query, token);
    } catch (error) {
      console.error("[Apify] Real search failed — falling back to mock data:", error);
      return this.searchLeadsMock(query);
    }
  }

  // ─── Real Apify Implementation ────────────────────────────────────────────

  private async searchLeadsReal(query: LeadSearchQuery, token: string): Promise<LeadSearchResponse> {
    const searchString = this.buildSearchString(query);
    const count = Math.min(query.count || 10, 50);

    console.log(`[Apify] Starting actor run for: "${searchString}" (max ${count} results)`);

    // Step 1: Start an async actor run
    const runUrl = `${APIFY_BASE_URL}/acts/${ACTOR_ID}/runs?token=${token}`;
    const runResponse = await fetch(runUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStringsArray: [searchString],
        maxCrawledPlacesPerSearch: count,
        language: "en",
        maxImages: 0,
        maxReviews: 0,
        includeOpeningHours: false,
        includePeopleAlsoSearch: false,
      }),
    });

    if (!runResponse.ok) {
      const body = await runResponse.text();
      throw new Error(`[Apify] Failed to start run (HTTP ${runResponse.status}): ${body}`);
    }

    const runBody = await runResponse.json();
    const run = runBody.data;

    if (!run?.id) {
      throw new Error(`[Apify] Actor run did not return a run ID. Response: ${JSON.stringify(runBody)}`);
    }

    const runId = run.id;
    const datasetId = run.defaultDatasetId;
    console.log(`[Apify] Run started. runId=${runId}, datasetId=${datasetId}`);

    // Step 2: Poll until run is SUCCEEDED or times out
    const succeededRun = await this.waitForRun(runId, token);
    const finalDatasetId = succeededRun.defaultDatasetId || datasetId;

    if (!finalDatasetId) {
      throw new Error("[Apify] No dataset ID after run completed.");
    }

    // Step 3: Fetch items from the dataset
    console.log(`[Apify] Fetching results from dataset: ${finalDatasetId}`);
    const itemsUrl = `${APIFY_BASE_URL}/datasets/${finalDatasetId}/items?token=${token}&limit=${count}`;
    const itemsResponse = await fetch(itemsUrl);

    if (!itemsResponse.ok) {
      throw new Error(`[Apify] Failed to fetch dataset items (HTTP ${itemsResponse.status})`);
    }

    const items = await itemsResponse.json();
    console.log(`[Apify] Got ${Array.isArray(items) ? items.length : 0} raw items from dataset`);

    if (!Array.isArray(items) || items.length === 0) {
      console.warn("[Apify] Dataset returned 0 items — search string may have no results on Google Maps.");
      return { leads: [], creditsUsed: 0 };
    }

    const leads = this.mapItemsToLeads(items, query, runId);
    const creditsUsed = succeededRun.usageUsd ? succeededRun.usageUsd * 1000 : count * 0.05;

    console.log(`[Apify] Mapped ${leads.length} leads successfully.`);
    return { leads, creditsUsed };
  }

  /** Poll Apify run status until SUCCEEDED, FAILED, or timeout */
  private async waitForRun(runId: string, token: string): Promise<Record<string, unknown>> {
    const deadline = Date.now() + MAX_WAIT_MS;

    while (Date.now() < deadline) {
      await this.sleep(POLL_INTERVAL_MS);

      const statusUrl = `${APIFY_BASE_URL}/actor-runs/${runId}?token=${token}`;
      const statusResponse = await fetch(statusUrl);

      if (!statusResponse.ok) {
        console.warn(`[Apify] Status check failed (HTTP ${statusResponse.status}), retrying...`);
        continue;
      }

      const statusBody = await statusResponse.json();
      const runData = statusBody.data as Record<string, unknown>;
      const status = runData?.status as string;

      console.log(`[Apify] Run ${runId} status: ${status}`);

      if (status === "SUCCEEDED") {
        return runData;
      }

      if (status === "FAILED" || status === "ABORTED" || status === "TIMED-OUT") {
        throw new Error(`[Apify] Run ${runId} ended with status: ${status}`);
      }

      // RUNNING or READY — keep polling
    }

    throw new Error(`[Apify] Run ${runId} did not finish within ${MAX_WAIT_MS / 1000}s timeout.`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ─── Map Apify Items → CreateLeadInput ──────────────────────────────────

  private mapItemsToLeads(
    items: Array<Record<string, unknown>>,
    query: LeadSearchQuery,
    runId: string
  ): CreateLeadInput[] {
    return items.map((item, idx) => {
      const company = (item.title as string) || (item.name as string) || `Business Lead #${idx + 1}`;
      const rawWebsite = item.website as string | undefined;

      let domain = "";
      if (rawWebsite) {
        try {
          domain = new URL(rawWebsite).hostname.replace("www.", "");
        } catch {
          domain = `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
        }
      } else {
        domain = `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
      }

      const phone = (item.phone as string) || null;
      const categoryName = (item.categoryName as string) || query.industry;
      const address = (item.address as string) || "";
      const city =
        (item.city as string) ||
        (item.location as Record<string, string>)?.city ||
        query.city ||
        null;
      const totalScore = item.totalScore as number | undefined;
      const reviewsCount = (item.reviewsCount as number) || 0;
      const placeId = (item.placeId as string) || (item.cid as string) || `gmap_${domain}_${idx}`;

      return {
        company,
        website: rawWebsite || null,
        phone,
        googlePlaceId: placeId,
        industry: categoryName,
        country: query.country,
        city,
        companySize: query.companySize || "11-50",
        contactName: null,
        contactTitle: null,
        email: rawWebsite ? `contact@${domain}` : null,
        whatsapp: phone,
        linkedin: null,
        painPoints: [
          totalScore
            ? `Google Rating: ${totalScore} ⭐ (${reviewsCount} reviews)`
            : `Listed on Google Maps`,
          address ? `Location: ${address}` : `Located in ${city || query.country}`,
        ],
        icebreaker: totalScore
          ? `Hi! I noticed ${company} has a strong ${totalScore}-star rating on Google Maps — impressive! I'd love to chat about how we can help you automate your client follow-up.`
          : `Hi! I found ${company} on Google Maps and think we could help grow your client pipeline.`,
        outreachAngle: `Help ${company} automate Google Maps reviews follow-up and local lead generation.`,
        estimatedValue: "$2,000 - $5,000",
        dealValue: 2000,
        stage: LeadStage.NEW,
        source: LeadSource.AI_FINDER,
        tags: ["Google-Maps", categoryName, query.country].filter(Boolean),
        notes: `Scraped via Apify Google Maps actor (run: ${runId}). Address: ${address}. Category: ${categoryName}. Rating: ${totalScore || "N/A"}/5 (${reviewsCount} reviews).`,
      } as CreateLeadInput;
    });
  }

  // ─── Mock Fallback ────────────────────────────────────────────────────────

  private searchLeadsMock(query: LeadSearchQuery): LeadSearchResponse {
    const count = query.count || 10;
    const leads: CreateLeadInput[] = [];
    const baseNames = [
      "Apex", "Elevate", "Vertex", "BlueSky", "Quantum",
      "Nexus", "Insight", "Streamline", "Catalyst", "Alpha",
      "Stellar", "Sync", "Forward", "Scale", "Direct",
      "Beacon", "Core", "Vanguard", "Optima", "Infinity",
    ];

    for (let i = 0; i < count; i++) {
      const prefix = baseNames[i % baseNames.length];
      const company = `${prefix} ${query.industry}`;
      const domain = company.toLowerCase().replace(/[^a-z0-9]/g, "");
      const website = `https://www.${domain}.io`;
      const phone = `+1 (${415 + i * 12}) 555-${1000 + i}`;
      const googlePlaceId = `ChIJ_mock_${domain}_${i}`;

      leads.push({
        company,
        website,
        phone,
        googlePlaceId,
        industry: query.industry,
        country: query.country,
        city: query.city || null,
        companySize: query.companySize || "11-50",
        contactName: null,
        contactTitle: null,
        email: `hello@${domain}.io`,
        whatsapp: phone,
        linkedin: `https://www.linkedin.com/company/${domain}`,
        painPoints: [
          `Lacks automated client acquisition processes`,
          `Needs custom integration for ${query.keywords || "CRM"} systems`,
        ],
        icebreaker: `Hi, I noticed ${company} is expanding its presence in ${query.country} but doesn't seem to have automated outreach configured.`,
        outreachAngle: `Help ${prefix} ${query.industry} automate their B2B client acquisition pipeline.`,
        estimatedValue: "$5,000 - $10,000",
        dealValue: 5000,
        stage: LeadStage.NEW,
        source: LeadSource.AI_FINDER,
        tags: ["Mock", query.industry],
        notes: "⚠️ Mock data — Apify token not configured or search failed.",
      });
    }

    return { leads, creditsUsed: count * 0.02 };
  }

  // ─── Build Search String ─────────────────────────────────────────────────

  private buildSearchString(query: LeadSearchQuery): string {
    const parts: string[] = [];

    if (query.keywords) {
      parts.push(`${query.industry} ${query.keywords}`);
    } else {
      parts.push(query.industry);
    }

    if (query.city) {
      parts.push(query.city);
    }

    parts.push(query.country);

    return parts.join(", ");
  }
}
