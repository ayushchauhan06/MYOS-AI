import { z } from "zod";
import { LeadStage, LeadSource } from "@prisma/client";

// Zod schema for validation
export const createLeadSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  googlePlaceId: z.string().optional().nullable(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional().nullable(),
  industry: z.string().optional().nullable(),
  companySize: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactTitle: z.string().optional().nullable(),
  email: z.string().email("Invalid email address").or(z.literal("")).optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal("")).optional().nullable(),
  painPoints: z.array(z.string()).default([]),
  icebreaker: z.string().optional().nullable(),
  outreachAngle: z.string().optional().nullable(),
  estimatedValue: z.string().optional().nullable(),
  dealValue: z.union([z.number(), z.string()]).transform((val) => {
    if (val === undefined || val === null || val === "") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }).optional().nullable(),
  stage: z.nativeEnum(LeadStage).default(LeadStage.NEW),
  source: z.nativeEnum(LeadSource).default(LeadSource.MANUAL),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().nullable(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const updateLeadStageSchema = z.object({
  leadId: z.string().min(1, "Lead ID is required"),
  stage: z.nativeEnum(LeadStage),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStageInput = z.infer<typeof updateLeadStageSchema>;

export interface LeadFilters {
  stage?: LeadStage;
  search?: string;
  industry?: string;
  source?: LeadSource;
  isArchived?: boolean;
}
