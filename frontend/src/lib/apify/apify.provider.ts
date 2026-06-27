import { LeadProvider, LeadSearchQuery, LeadSearchResponse } from "../leads/lead-provider.interface";
import { CreateLeadInput } from "@/modules/leads/lead.types";
import { LeadStage, LeadSource } from "@prisma/client";

export class ApifyLeadProvider implements LeadProvider {
  async searchLeads(query: LeadSearchQuery): Promise<LeadSearchResponse> {
    const token = process.env.APIFY_TOKEN;

    if (!token || token.trim() === "" || token.includes("replace-me")) {
      console.log("Apify token not found, falling back to mock search execution.");
      return this.searchLeadsMock(query);
    }

    try {
      return await this.searchLeadsReal(query, token);
    } catch (error) {
      console.error("Apify search execution failed, falling back to mock:", error);
      return this.searchLeadsMock(query);
    }
  }

  private async searchLeadsReal(query: LeadSearchQuery, token: string): Promise<LeadSearchResponse> {
    const searchString = this.buildSearchString(query);
    const count = query.count || 10;

    // Run the compass/crawler-google-places actor synchronously, waiting up to 60s
    const runUrl = `https://api.apify.com/v2/acts/compass~crawler-google-places/run?token=${token}&wait=60`;
    const response = await fetch(runUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchStrings: [searchString],
        maxCrawledPlacesPerSearch: count,
        exportPlaceUrls: false,
        includeReviews: false,
        includeImages: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Apify run failed with status ${response.status}`);
    }

    const runData = await response.json();
    const run = runData.data;
    if (!run || !run.defaultDatasetId) {
      throw new Error("Apify run did not return a default dataset ID");
    }

    const datasetId = run.defaultDatasetId;
    const runId = run.id;

    // Fetch items from dataset
    const itemsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`;
    const itemsResponse = await fetch(itemsUrl);
    if (!itemsResponse.ok) {
      throw new Error(`Failed to fetch Apify dataset items for dataset ${datasetId}`);
    }

    const items = await itemsResponse.json();
    if (!Array.isArray(items)) {
      throw new Error("Apify dataset items is not an array");
    }

    const leads: CreateLeadInput[] = (items as Array<{
      title?: string;
      name?: string;
      website?: string;
      phone?: string;
      placeId?: string;
      cid?: string;
      categoryName?: string;
      city?: string;
      totalScore?: number;
      reviewsCount?: number;
      address?: string;
    }>).map((item, idx) => {
      const company = item.title || item.name || `Business Lead #${idx + 1}`;
      let domain = "";
      if (item.website) {
        try {
          domain = new URL(item.website).hostname.replace("www.", "");
        } catch {
          domain = `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
        }
      } else {
        domain = `${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
      }

      return {
        company,
        website: item.website || null,
        phone: item.phone || null,
        googlePlaceId: item.placeId || item.cid || `ChIJ_${domain}`,
        industry: item.categoryName || query.industry,
        country: query.country,
        city: item.city || query.city || null,
        companySize: query.companySize || "11-50",
        contactName: null,
        contactTitle: null,
        email: `contact@${domain}`,
        whatsapp: item.phone || null,
        linkedin: null,
        painPoints: [
          `Google Rating: ${item.totalScore || "N/A"} (${item.reviewsCount || 0} reviews)`,
          `Address: ${item.address || "N/A"}`
        ],
        icebreaker: `Hi, congrats on your ${item.totalScore || "4.5"}-star Google rating in ${item.city || query.city || "your area"}!`,
        outreachAngle: "Optimize Google Maps presence and automate customer follow-up flows.",
        estimatedValue: "$2,000",
        dealValue: 2000,
        stage: LeadStage.NEW,
        source: LeadSource.AI_FINDER,
        tags: ["Scraped", item.categoryName || query.industry],
        notes: `Scraped from Google Maps run ${runId}. Address: ${item.address || ""}. Category: ${item.categoryName || ""}.`,
      };
    });

    const creditsUsed = run.usageUsd ? run.usageUsd * 1000 : count * 0.05;

    return { leads, creditsUsed };
  }

  private searchLeadsMock(query: LeadSearchQuery): LeadSearchResponse {
    const count = query.count || 10;
    const leads: CreateLeadInput[] = [];
    const baseNames = [
      "Apex", "Elevate", "Vertex", "BlueSky", "Quantum", 
      "Nexus", "Insight", "Streamline", "Catalyst", "Alpha", 
      "Stellar", "Sync", "Forward", "Scale", "Direct", 
      "Beacon", "Core", "Vanguard", "Optima", "Infinity"
    ];
    
    for (let i = 0; i < count; i++) {
      const prefix = baseNames[i % baseNames.length];
      const company = `${prefix} ${query.industry}`;
      const domain = company.toLowerCase().replace(/[^a-z0-9]/g, "");
      const website = `https://www.${domain}.io`;
      const phone = `+1 (${415 + (i * 12)}) 555-${1000 + i}`;
      const googlePlaceId = `ChIJ_${domain}_${i}`;
      
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
          `Needs custom integration for ${query.keywords || "CRM"} systems`
        ],
        icebreaker: `Hi, I noticed ${company} is expanding its presence in ${query.country} but doesn't seem to have automated outreach configured.`,
        outreachAngle: `Help ${prefix} ${query.industry} automate their B2B client acquisition pipeline.`,
        estimatedValue: "$5,000 - $10,000",
        dealValue: 5000,
        stage: LeadStage.NEW,
        source: LeadSource.AI_FINDER,
        tags: ["Mock-Scraped", query.industry],
        notes: "Mock scraped and qualified by MYOS local Lead Finder.",
      });
    }

    const creditsUsed = count * 0.02; // Mock credits used
    return { leads, creditsUsed };
  }

  private buildSearchString(query: LeadSearchQuery): string {
    const parts: string[] = [];
    if (query.keywords) {
      parts.push(`${query.industry} (${query.keywords})`);
    } else {
      parts.push(query.industry);
    }
    
    if (query.city) {
      parts.push(`in ${query.city}`);
    }
    
    parts.push(query.country);
    
    return parts.join(" ");
  }
}
