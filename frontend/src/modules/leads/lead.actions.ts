"use server";

import { LeadService } from "./lead.service";
import { CreateLeadInput, UpdateLeadInput, LeadFilters } from "./lead.types";
import { LeadStage, Lead } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { LeadSearchQuery } from "@/lib/leads/lead-provider.interface";
import { db } from "@/lib/db";

const leadService = new LeadService();

// Default workspace and user ID for local MVP validation
const DEFAULT_WORKSPACE_ID = "ws_1";
const DEFAULT_USER_ID = "usr_1";

async function getActiveWorkspaceId(): Promise<string> {
  return DEFAULT_WORKSPACE_ID;
}

// Automatically seeds the local DB with a default user and workspace if missing
async function ensureUserAndWorkspaceExist(workspaceId: string, userId: string) {
  // Ensure user
  let user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await db.user.create({
      data: {
        id: userId,
        email: "default@myos.ai",
        name: "Default Freelancer",
        role: "FREELANCER",
        plan: "FREE",
      }
    });
  }

  // Ensure workspace
  let workspace = await db.workspace.findUnique({ where: { id: workspaceId } });
  if (!workspace) {
    workspace = await db.workspace.create({
      data: {
        id: workspaceId,
        name: "Default Workspace",
        slug: "default-workspace",
        plan: "FREE",
      }
    });
  }

  // Ensure workspace membership
  const membership = await db.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
  if (!membership) {
    await db.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role: "OWNER",
      }
    });
  }
}

function serializeLead(lead: Lead | null) {
  if (!lead) return null;
  return {
    ...lead,
    dealValue: lead.dealValue ? Number(lead.dealValue) : null,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export async function getLeadsAction(filters?: LeadFilters) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    const leads = await leadService.getLeads(workspaceId, filters);
    const serializedLeads = leads.map((l) => serializeLead(l));
    
    return { success: true, data: serializedLeads, leads: serializedLeads };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in getLeadsAction:", error);
    return { success: false, error: message };
  }
}

export async function saveLeadAction(input: CreateLeadInput) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    const lead = await leadService.createLead(workspaceId, input);
    const serializedLead = serializeLead(lead);
    
    revalidatePath("/leads");
    return { success: true, data: serializedLead, lead: serializedLead };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in saveLeadAction:", error);
    return { success: false, error: message };
  }
}

export async function searchLeadsAction(query: LeadSearchQuery) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    const leads = await leadService.searchLeads(workspaceId, DEFAULT_USER_ID, query);
    const serializedLeads = leads.map((l) => serializeLead(l));
    
    return { success: true, data: serializedLeads, leads: serializedLeads };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in searchLeadsAction:", error);
    return { success: false, error: message };
  }
}

export async function updateLeadAction(id: string, input: UpdateLeadInput) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    const lead = await leadService.updateLead(id, workspaceId, input);
    const serializedLead = serializeLead(lead);
    
    revalidatePath("/leads");
    return { success: true, data: serializedLead, lead: serializedLead };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in updateLeadAction:", error);
    return { success: false, error: message };
  }
}

export async function updateLeadStageAction(id: string, stage: LeadStage) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    const lead = await leadService.updateLeadStage(id, workspaceId, stage);
    const serializedLead = serializeLead(lead);
    
    revalidatePath("/leads");
    return { success: true, data: serializedLead, lead: serializedLead };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in updateLeadStageAction:", error);
    return { success: false, error: message };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    await leadService.deleteLead(id, workspaceId);
    
    revalidatePath("/leads");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in deleteLeadAction:", error);
    return { success: false, error: message };
  }
}

export async function removeLeadAction(id: string) {
  return deleteLeadAction(id);
}

export async function archiveLeadAction(id: string, isArchived: boolean = true) {
  try {
    const workspaceId = await getActiveWorkspaceId();
    await ensureUserAndWorkspaceExist(workspaceId, DEFAULT_USER_ID);
    
    const lead = await leadService.archiveLead(id, workspaceId, isArchived);
    const serializedLead = serializeLead(lead);
    
    revalidatePath("/leads");
    return { success: true, data: serializedLead, lead: serializedLead };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in archiveLeadAction:", error);
    return { success: false, error: message };
  }
}
