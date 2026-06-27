import { db } from "@/lib/db";
import { CreateLeadInput, UpdateLeadInput, LeadFilters } from "./lead.types";
import { LeadStage, Prisma } from "@prisma/client";

export class LeadRepository {
  async findMany(workspaceId: string, filters?: LeadFilters) {
    const where: Prisma.LeadWhereInput = {
      workspaceId,
      isArchived: filters?.isArchived ?? false,
    };

    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.source) {
      where.source = filters.source;
    }

    if (filters?.search) {
      where.OR = [
        { company: { contains: filters.search, mode: "insensitive" } },
        { contactName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { industry: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, workspaceId: string) {
    return db.lead.findFirst({
      where: { id, workspaceId },
    });
  }

  async findByUniqueFields(workspaceId: string, fields: { googlePlaceId?: string | null; website?: string | null; phone?: string | null; email?: string | null }) {
    const OR: Prisma.LeadWhereInput[] = [];
    if (fields.googlePlaceId) OR.push({ googlePlaceId: fields.googlePlaceId });
    if (fields.website) OR.push({ website: fields.website });
    if (fields.phone) OR.push({ phone: fields.phone });
    if (fields.email) OR.push({ email: fields.email });

    if (OR.length === 0) return null;

    return db.lead.findFirst({
      where: {
        workspaceId,
        OR,
      },
    });
  }

  async create(workspaceId: string, data: CreateLeadInput & { isArchived?: boolean }) {
    return db.lead.create({
      data: {
        workspaceId,
        googlePlaceId: data.googlePlaceId,
        company: data.company,
        website: data.website,
        industry: data.industry,
        companySize: data.companySize,
        country: data.country,
        city: data.city,
        contactName: data.contactName,
        contactTitle: data.contactTitle,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        linkedin: data.linkedin,
        painPoints: data.painPoints || [],
        icebreaker: data.icebreaker,
        outreachAngle: data.outreachAngle,
        estimatedValue: data.estimatedValue,
        dealValue: data.dealValue ? new Prisma.Decimal(data.dealValue) : null,
        stage: data.stage || LeadStage.NEW,
        source: data.source || "MANUAL",
        isArchived: data.isArchived ?? false,
        tags: data.tags || [],
        notes: data.notes,
      },
    });
  }

  async update(id: string, workspaceId: string, data: UpdateLeadInput) {
    const updateData: Prisma.LeadUpdateInput = {};

    if (data.googlePlaceId !== undefined) updateData.googlePlaceId = data.googlePlaceId;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.industry !== undefined) updateData.industry = data.industry;
    if (data.companySize !== undefined) updateData.companySize = data.companySize;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.contactName !== undefined) updateData.contactName = data.contactName;
    if (data.contactTitle !== undefined) updateData.contactTitle = data.contactTitle;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
    if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
    if (data.painPoints !== undefined) updateData.painPoints = data.painPoints;
    if (data.icebreaker !== undefined) updateData.icebreaker = data.icebreaker;
    if (data.outreachAngle !== undefined) updateData.outreachAngle = data.outreachAngle;
    if (data.estimatedValue !== undefined) updateData.estimatedValue = data.estimatedValue;
    if (data.dealValue !== undefined) {
      updateData.dealValue = data.dealValue ? new Prisma.Decimal(data.dealValue) : null;
    }
    if (data.stage !== undefined) updateData.stage = data.stage;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.notes !== undefined) updateData.notes = data.notes;

    return db.lead.update({
      where: { id, workspaceId },
      data: updateData,
    });
  }

  async updateStage(id: string, workspaceId: string, stage: LeadStage) {
    return db.lead.update({
      where: { id, workspaceId },
      data: { stage },
    });
  }

  async delete(id: string, workspaceId: string) {
    return db.$transaction(async (tx) => {
      // Delete activities
      await tx.activity.deleteMany({ where: { leadId: id } });
      // Delete campaign associations
      await tx.campaignLead.deleteMany({ where: { leadId: id } });
      // Delete WhatsApp messages
      await tx.whatsAppMessage.deleteMany({ where: { leadId: id } });
      // Nullify proposals and emails
      await tx.proposal.updateMany({ where: { leadId: id }, data: { leadId: null } });
      await tx.email.updateMany({ where: { leadId: id }, data: { leadId: null } });
      // Delete the lead
      return tx.lead.delete({
        where: { id, workspaceId },
      });
    });
  }

  async archive(id: string, workspaceId: string, isArchived: boolean = true) {
    return db.lead.update({
      where: { id, workspaceId },
      data: { isArchived },
    });
  }
}
