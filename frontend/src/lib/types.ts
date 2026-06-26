// ── Shared TypeScript Types for MYOS AI Frontend ─────────────────────────────
// These mirror the Prisma schema exactly for backend compatibility.

export type UserRole = "ADMIN" | "FREELANCER";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";
export type PlanType = "FREE" | "STARTER" | "PRO" | "AGENCY";

export type LeadStage =
  | "NEW"
  | "CONTACT_READY"
  | "EMAIL_SENT"
  | "WHATSAPP_SENT"
  | "REPLIED"
  | "MEETING_SCHEDULED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type LeadSource = "AI_FINDER" | "MANUAL" | "IMPORT" | "API" | "REFERRAL";
export type ProposalStatus = "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type CampaignType = "EMAIL" | "WHATSAPP" | "COMBINED";
export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
export type EmailStatus = "PENDING" | "SENT" | "DELIVERED" | "OPENED" | "CLICKED" | "REPLIED" | "BOUNCED" | "FAILED";

// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  plan: PlanType;
  createdAt: string;
  updatedAt: string;
}

// ── Lead ──────────────────────────────────────────────────────────────────────
export interface Lead {
  id: string;
  workspaceId: string;
  company: string;
  website?: string;
  industry?: string;
  companySize?: string;
  country?: string;
  city?: string;
  contactName?: string;
  contactTitle?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
  painPoints: string[];
  icebreaker?: string;
  outreachAngle?: string;
  estimatedValue?: string;
  leadScore: number;
  aiConfidence: number;
  stage: LeadStage;
  tags: string[];
  notes?: string;
  dealValue?: number;
  source: LeadSource;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Proposal ──────────────────────────────────────────────────────────────────
export interface ProposalPackage {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export interface ProposalTimeline {
  phase: string;
  duration: string;
  tasks: string[];
}

export interface ProposalMilestone {
  name: string;
  percentage: number;
  amount: number;
}

export interface ProposalContent {
  title: string;
  introduction: string;
  problemAnalysis: string;
  proposedSolution: string;
  scopeOfWork: string[];
  deliverables: string[];
  timeline: ProposalTimeline[];
  pricing: { packages: ProposalPackage[] };
  milestones: ProposalMilestone[];
  technologies: string[];
  terms: string[];
  closing: string;
}

export interface Proposal {
  id: string;
  workspaceId: string;
  leadId?: string;
  title: string;
  status: ProposalStatus;
  projectType?: string;
  budget?: string;
  timeline?: string;
  requirements?: string;
  content: ProposalContent | null;
  shareToken?: string | null;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
}

// ── Campaign ──────────────────────────────────────────────────────────────────
export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  config: Record<string, unknown>;
  totalLeads: number;
  emailsSent: number;
  opens: number;
  clicks: number;
  replies: number;
  conversions: number;
  scheduledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Email Log ─────────────────────────────────────────────────────────────────
export interface EmailLog {
  id: string;
  workspaceId: string;
  leadId?: string;
  campaignId?: string;
  to: string;
  subject: string;
  body: string;
  status: EmailStatus;
  resendId?: string;
  openedAt?: string;
  clickedAt?: string;
  repliedAt?: string;
  bouncedAt?: string;
  sentAt?: string;
  createdAt: string;
}

// ── Activity ──────────────────────────────────────────────────────────────────
export interface Activity {
  id: string;
  leadId: string;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
export interface KPICardData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendLabel: string;
  iconName: string;
  iconColor: string;
  sparklineData: number[];
}

// ── Notification ──────────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: "lead_found" | "email_opened" | "lead_replied" | "whatsapp_read" | "meeting_scheduled" | "proposal_accepted";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

// ── Automation Node ───────────────────────────────────────────────────────────
export interface AutomationNode {
  id: string;
  type: "trigger" | "action" | "condition" | "delay" | "end";
  name: string;
  description?: string;
  x: number;
  y: number;
  config: Record<string, unknown>;
}

export interface AutomationEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

// ── Server Action Response Shape ─────────────────────────────────────────────
// Matches the backend's consistent response format
export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
