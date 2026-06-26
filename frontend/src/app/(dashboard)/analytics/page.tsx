import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics — MYOS AI",
  description: "Deep analytics on your lead generation, email outreach, and campaign performance.",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
