// ── Analytics Mock Data ───────────────────────────────────────────────────────

// 30-day daily leads time series
export const leadsOverTime = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    leads: Math.floor(60 + Math.random() * 80 + i * 2.5),
    qualified: Math.floor(20 + Math.random() * 35 + i * 1.2),
  };
});

// Email performance by day
export const emailPerformance = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return {
    date: date.toLocaleDateString("en-US", { weekday: "short" }),
    sent: Math.floor(280 + Math.random() * 120),
    opened: Math.floor(120 + Math.random() * 80),
    clicked: Math.floor(40 + Math.random() * 30),
    replied: Math.floor(12 + Math.random() * 18),
  };
});

// Reply rate trend
export const replyRateTrend = Array.from({ length: 8 }, (_, i) => {
  const week = `W${i + 1}`;
  return {
    week,
    email: parseFloat((8 + Math.random() * 8 + i * 0.4).toFixed(1)),
    whatsapp: parseFloat((18 + Math.random() * 12 + i * 0.6).toFixed(1)),
  };
});

// Conversion funnel
export const conversionFunnel = [
  { stage: "Leads Found", count: 2847, percentage: 100 },
  { stage: "Contacted", count: 1842, percentage: 64.7 },
  { stage: "Email Opened", count: 1124, percentage: 39.5 },
  { stage: "Replied", count: 347, percentage: 12.2 },
  { stage: "Meeting Booked", count: 89, percentage: 3.1 },
  { stage: "Proposal Sent", count: 67, percentage: 2.4 },
  { stage: "Won", count: 34, percentage: 1.2 },
];

// Lead source breakdown
export const leadSourceBreakdown = [
  { source: "AI Finder", count: 1842, color: "#2563EB" },
  { source: "Manual Entry", count: 423, color: "#7C3AED" },
  { source: "CSV Import", count: 312, color: "#059669" },
  { source: "Referral", count: 189, color: "#DB2777" },
  { source: "API", count: 81, color: "#D97706" },
];

// Top performing campaigns
export const topCampaigns = [
  {
    id: "c1",
    name: "SaaS Founders Cold Outreach",
    type: "EMAIL",
    leads: 142,
    openRate: 55.1,
    replyRate: 18.4,
    conversions: 7,
    revenue: 84000,
  },
  {
    id: "c2",
    name: "E-commerce Founders — WhatsApp",
    type: "WHATSAPP",
    leads: 78,
    openRate: 0,
    replyRate: 30.8,
    conversions: 9,
    revenue: 67500,
  },
  {
    id: "c4",
    name: "Healthcare CTOs — Enterprise",
    type: "EMAIL",
    leads: 35,
    openRate: 62.9,
    replyRate: 25.7,
    conversions: 4,
    revenue: 142000,
  },
  {
    id: "c3",
    name: "Agency Owners — Multi-Touch",
    type: "COMBINED",
    leads: 65,
    openRate: 62.2,
    replyRate: 17.8,
    conversions: 3,
    revenue: 21000,
  },
];

// AI Insights
export const aiInsights = [
  {
    id: "i1",
    title: "Best Send Time Detected",
    description:
      "Your emails sent between 9–11 AM on Tuesdays get 34% higher open rates. Consider shifting all campaigns to this window.",
    type: "optimization",
    impact: "high",
    metric: "+34% opens",
  },
  {
    id: "i2",
    title: "WhatsApp Outperforming Email",
    description:
      "WhatsApp campaigns are generating 30.8% reply rates vs 18.4% for email. Consider shifting 30% of your outreach to WhatsApp.",
    type: "channel",
    impact: "high",
    metric: "30.8% reply rate",
  },
  {
    id: "i3",
    title: "Healthcare Vertical High-Value",
    description:
      "Healthcare leads have an average deal value of $35,500 — 3.2× your overall average. Increasing focus here could lift revenue by $142K.",
    type: "segment",
    impact: "medium",
    metric: "$35,500 avg deal",
  },
];

// KPI sparkline data
export const kpiSparklines = {
  leads: [18, 24, 21, 35, 28, 42, 38, 55, 47, 62, 58, 72],
  emails: [420, 380, 490, 510, 445, 600, 580, 720, 690, 810, 765, 880],
  whatsapp: [85, 92, 78, 110, 98, 125, 115, 142, 138, 162, 155, 178],
  replies: [28, 22, 31, 18, 35, 29, 42, 38, 25, 44, 40, 52],
  positive: [12, 10, 15, 8, 18, 14, 22, 19, 13, 24, 21, 28],
  meetings: [2, 3, 1, 4, 3, 5, 4, 6, 5, 7, 6, 8],
  proposalRate: [58, 61, 55, 64, 60, 67, 63, 69, 66, 71, 68, 74],
  pipeline: [180000, 195000, 210000, 225000, 240000, 255000, 248000, 262000, 270000, 278000, 282000, 284000],
};

// Activity feed items
export const activityFeed = [
  {
    id: "a1",
    type: "lead_found",
    title: "New lead found",
    description: "CloudNine Logistics — David Park (VP Technology)",
    time: new Date(Date.now() - 5 * 60000).toISOString(),
    color: "emerald",
  },
  {
    id: "a2",
    type: "email_opened",
    title: "Email opened",
    description: "Sarah Chen (TechFlow Solutions) opened your intro email",
    time: new Date(Date.now() - 18 * 60000).toISOString(),
    color: "blue",
  },
  {
    id: "a3",
    type: "lead_replied",
    title: "Lead replied",
    description: "Dr. Marcus Reed (MedSync) replied to your follow-up",
    time: new Date(Date.now() - 45 * 60000).toISOString(),
    color: "purple",
  },
  {
    id: "a4",
    type: "meeting_scheduled",
    title: "Meeting scheduled",
    description: "Alexandra Torres (Launchpad VC) — Tomorrow at 2 PM EST",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    color: "orange",
  },
  {
    id: "a5",
    type: "proposal_accepted",
    title: "Proposal accepted!",
    description: "Roberto Díaz (Coastal PG) accepted your $12,000 proposal",
    time: new Date(Date.now() - 3 * 3600000).toISOString(),
    color: "emerald",
  },
  {
    id: "a6",
    type: "whatsapp_read",
    title: "WhatsApp read",
    description: "Priya Kapoor (GreenCart) read your WhatsApp message",
    time: new Date(Date.now() - 5 * 3600000).toISOString(),
    color: "teal",
  },
  {
    id: "a7",
    type: "email_opened",
    title: "Email opened",
    description: "Lukas Becker (DevHive) opened your proposal email",
    time: new Date(Date.now() - 6 * 3600000).toISOString(),
    color: "blue",
  },
  {
    id: "a8",
    type: "lead_found",
    title: "New lead found",
    description: "EduPath Learning — Rachel Kim (Head of Product)",
    time: new Date(Date.now() - 8 * 3600000).toISOString(),
    color: "emerald",
  },
];

// Notification items
export const mockNotifications = [
  {
    id: "n1",
    type: "lead_found",
    title: "New lead found",
    description: "AI found 8 new SaaS leads matching your criteria",
    time: new Date(Date.now() - 3 * 60000).toISOString(),
    read: false,
  },
  {
    id: "n2",
    type: "email_opened",
    title: "Email opened",
    description: "Sarah Chen opened your cold email — 3rd time this week",
    time: new Date(Date.now() - 22 * 60000).toISOString(),
    read: false,
  },
  {
    id: "n3",
    type: "lead_replied",
    title: "Lead replied",
    description: "Dr. Marcus Reed replied: 'Interesting — can we set up a call?'",
    time: new Date(Date.now() - 48 * 60000).toISOString(),
    read: false,
  },
  {
    id: "n4",
    type: "whatsapp_read",
    title: "WhatsApp read",
    description: "Priya Kapoor read your WhatsApp message (2 blue ticks)",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
  },
  {
    id: "n5",
    type: "meeting_scheduled",
    title: "Meeting scheduled",
    description: "Call with Alexandra Torres — Jun 27, 2PM EST",
    time: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
  },
  {
    id: "n6",
    type: "proposal_accepted",
    title: "Proposal accepted! 🎉",
    description: "Coastal Property Group accepted your $12,000 proposal",
    time: new Date(Date.now() - 26 * 3600000).toISOString(),
    read: true,
  },
  {
    id: "n7",
    type: "lead_found",
    title: "Campaign completed",
    description: "Healthcare CTOs campaign completed — 4 conversions",
    time: new Date(Date.now() - 48 * 3600000).toISOString(),
    read: true,
  },
];
