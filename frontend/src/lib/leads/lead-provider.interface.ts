import { CreateLeadInput } from "@/modules/leads/lead.types";

export interface LeadSearchQuery {
  industry: string;
  country: string;
  city?: string;
  businessType?: string;
  companySize?: string;
  keywords?: string;
  count: number;
}

export interface LeadSearchResponse {
  leads: CreateLeadInput[];
  creditsUsed: number;
}

export interface LeadProvider {
  searchLeads(query: LeadSearchQuery): Promise<LeadSearchResponse>;
}
