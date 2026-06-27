import { LeadRepository } from "./lead.repository";
import {
  createLeadSchema,
  updateLeadSchema,
  CreateLeadInput,
  UpdateLeadInput,
  LeadFilters,
} from "./lead.types";
import { LeadStage, LeadSource, Lead } from "@prisma/client";
import { db } from "@/lib/db";
import { LeadSearchQuery } from "@/lib/leads/lead-provider.interface";
import { ApifyLeadProvider } from "@/lib/apify/apify.provider";

export class LeadService {
  private repository = new LeadRepository();

  async getLeads(workspaceId: string, filters?: LeadFilters) {
    return this.repository.findMany(workspaceId, filters);
  }

  async getLead(id: string, workspaceId: string) {
    return this.repository.findById(id, workspaceId);
  }

  async createLead(workspaceId: string, input: CreateLeadInput) {
    const validatedData = createLeadSchema.parse(input);

    // Deduplication check: verify if a lead with same email, website, phone, or googlePlaceId already exists
    const existingLead = await this.repository.findByUniqueFields(workspaceId, {
      googlePlaceId: validatedData.googlePlaceId,
      website: validatedData.website,
      phone: validatedData.phone,
      email: validatedData.email,
    });

    if (existingLead) {
      // Merge values
      const mergedData = this.mergeLeadData(
        existingLead as unknown as Record<string, unknown>,
        validatedData as unknown as Record<string, unknown>
      );
      
      // Since the user is explicitly saving/creating this lead, we also restore it if it was archived
      const updatePayload: Record<string, unknown> = { ...mergedData };
      if (existingLead.isArchived) {
        updatePayload.isArchived = false;
        updatePayload.stage = validatedData.stage || LeadStage.NEW;
      }
      
      if (Object.keys(updatePayload).length > 0) {
        const updated = await this.repository.update(existingLead.id, workspaceId, updatePayload);
        await db.activity.create({
          data: {
            leadId: existingLead.id,
            type: "lead_updated",
            description: existingLead.isArchived 
              ? "Lead restored and saved to CRM pipeline" 
              : "Lead details updated automatically during deduplication",
            metadata: { updatedFields: Object.keys(updatePayload) }
          }
        });
        return updated;
      }
      
      return existingLead;
    }

    // Otherwise, create a new lead
    const newLead = await this.repository.create(workspaceId, validatedData);
    
    await db.activity.create({
      data: {
        leadId: newLead.id,
        type: "lead_created",
        description: `Lead created manually via ${validatedData.source}`,
        metadata: { source: validatedData.source }
      }
    });

    return newLead;
  }

  async searchLeads(workspaceId: string, userId: string, query: LeadSearchQuery) {
    const provider = new ApifyLeadProvider();
    
    // Execute Apify search
    const { leads, creditsUsed } = await provider.searchLeads(query);
    
    const results: Lead[] = [];
    
    for (const leadInput of leads) {
      // Deduplicate check
      const existingLead = await this.repository.findByUniqueFields(workspaceId, {
        googlePlaceId: leadInput.googlePlaceId,
        website: leadInput.website,
        phone: leadInput.phone,
        email: leadInput.email,
      });

      if (existingLead) {
        // Merge values
        const mergedData = this.mergeLeadData(
          existingLead as unknown as Record<string, unknown>,
          leadInput as unknown as Record<string, unknown>
        );

        if (Object.keys(mergedData).length > 0) {
          const updated = await this.repository.update(existingLead.id, workspaceId, mergedData);
          await db.activity.create({
            data: {
              leadId: existingLead.id,
              type: "lead_updated",
              description: "Lead details updated automatically during web search refresh",
              metadata: { updatedFields: Object.keys(mergedData) }
            }
          });
          results.push(updated);
        } else {
          results.push(existingLead);
        }
      } else {
        // Create new lead as archived by default so it doesn't clutter active Kanban CRM
        const created = await this.repository.create(workspaceId, {
          ...leadInput,
          isArchived: true,
        });

        await db.activity.create({
          data: {
            leadId: created.id,
            type: "lead_found",
            description: "Lead discovered via AI web search",
            metadata: { source: "AI_FINDER" }
          }
        });
        results.push(created);
      }
    }

    // Save Search History
    await db.searchHistory.create({
      data: {
        workspaceId,
        userId,
        query: `${query.industry} in ${query.city || ""}, ${query.country}`,
        filters: JSON.parse(JSON.stringify(query)),
        leadsCount: results.length,
        apifyCreditsUsed: creditsUsed,
      }
    });

    return results;
  }

  async updateLead(id: string, workspaceId: string, input: UpdateLeadInput) {
    const validatedData = updateLeadSchema.parse(input);
    const updated = await this.repository.update(id, workspaceId, validatedData);

    await db.activity.create({
      data: {
        leadId: id,
        type: "lead_updated",
        description: "Lead details updated manually",
        metadata: { updatedFields: Object.keys(validatedData) }
      }
    });

    return updated;
  }

  async updateLeadStage(id: string, workspaceId: string, stage: LeadStage) {
    const updated = await this.repository.updateStage(id, workspaceId, stage);

    await db.activity.create({
      data: {
        leadId: id,
        type: "stage_changed",
        description: `Stage updated to ${stage}`,
        metadata: { newStage: stage }
      }
    });

    return updated;
  }

  async deleteLead(id: string, workspaceId: string) {
    return this.repository.delete(id, workspaceId);
  }

  async archiveLead(id: string, workspaceId: string, isArchived: boolean = true) {
    const updated = await this.repository.archive(id, workspaceId, isArchived);
    
    await db.activity.create({
      data: {
        leadId: id,
        type: isArchived ? "lead_archived" : "lead_unarchived",
        description: isArchived ? "Lead archived" : "Lead restored from archive",
      }
    });

    return updated;
  }

  private mergeLeadData(existing: Record<string, unknown>, input: Record<string, unknown>) {
    const merged: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      const inputValue = input[key];
      const existingValue = existing[key];
      
      // If input value is provided (not null/undefined/empty string/empty array)
      if (inputValue !== undefined && inputValue !== null && inputValue !== "" && (!Array.isArray(inputValue) || inputValue.length > 0)) {
        // Overwrite if existing value is empty, or if they are different
        if (existingValue === undefined || existingValue === null || existingValue === "" || JSON.stringify(existingValue) !== JSON.stringify(inputValue)) {
          merged[key] = inputValue;
        }
      }
    }
    return merged;
  }
}
