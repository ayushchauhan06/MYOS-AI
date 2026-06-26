import type { Metadata } from "next";
import { mockCampaigns } from "@/lib/mock-data/campaigns";
import { CampaignCard } from "@/components/campaigns/CampaignCard";

export const metadata: Metadata = {
  title: "Campaign Manager — MYOS AI",
  description: "Manage your email and WhatsApp outreach campaigns with AI-powered automation.",
};

export default function CampaignsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Campaign Manager</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your outreach campaigns</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
          + New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockCampaigns.map((campaign, i) => (
          <CampaignCard key={campaign.id} campaign={campaign} delay={i * 0.06} />
        ))}
      </div>
    </div>
  );
}
