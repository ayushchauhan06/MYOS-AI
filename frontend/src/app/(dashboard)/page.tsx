import type { Metadata } from "next";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart, EmailPerformanceChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { LeadSourcePanel } from "@/components/dashboard/LeadSourcePanel";
import { kpiSparklines } from "@/lib/mock-data/analytics";

export const metadata: Metadata = {
  title: "Dashboard — MYOS AI",
  description: "Your AI-powered freelancer operating system dashboard. Monitor leads, campaigns, revenue pipeline, and more.",
};

const kpis = [
  {
    title: "Total Leads",
    value: 2847,
    trend: 18.2,
    trendLabel: "vs last month",
    iconName: "Users",
    iconColor: "blue",
    sparklineData: kpiSparklines.leads,
  },
  {
    title: "Emails Sent",
    value: 12439,
    trend: 7.4,
    trendLabel: "vs last month",
    iconName: "Mail",
    iconColor: "indigo",
    sparklineData: kpiSparklines.emails,
  },
  {
    title: "WhatsApp Sent",
    value: 3621,
    trend: 22.1,
    trendLabel: "vs last month",
    iconName: "MessageCircle",
    iconColor: "green",
    sparklineData: kpiSparklines.whatsapp,
  },
  {
    title: "Replies Received",
    value: 891,
    trend: -3.2,
    trendLabel: "vs last month",
    iconName: "MessageSquare",
    iconColor: "amber",
    sparklineData: kpiSparklines.replies,
  },
  {
    title: "Positive Responses",
    value: 347,
    trend: 14.8,
    trendLabel: "vs last month",
    iconName: "ThumbsUp",
    iconColor: "teal",
    sparklineData: kpiSparklines.positive,
  },
  {
    title: "Meetings Booked",
    value: 89,
    trend: 31.5,
    trendLabel: "vs last month",
    iconName: "Calendar",
    iconColor: "purple",
    sparklineData: kpiSparklines.meetings,
  },
  {
    title: "Proposal Accept Rate",
    value: 68,
    suffix: "%",
    trend: 5.1,
    trendLabel: "vs last month",
    iconName: "FileCheck",
    iconColor: "pink",
    sparklineData: kpiSparklines.proposalRate,
  },
  {
    title: "Revenue Pipeline",
    value: 284000,
    prefix: "$",
    trend: 42.3,
    trendLabel: "vs last month",
    iconName: "DollarSign",
    iconColor: "rose",
    sparklineData: kpiSparklines.pipeline,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Hero */}
      <HeroSection />

      {/* KPI Cards — 4-column grid */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.title} {...kpi} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Revenue Chart + Activity Feed */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </section>

      {/* Email Performance + Lead Source */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EmailPerformanceChart />
        <LeadSourcePanel />
      </section>
    </div>
  );
}


