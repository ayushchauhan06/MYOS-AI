"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, Sparkles } from "lucide-react";
import { mockCampaigns } from "@/lib/mock-data/campaigns";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import type { Campaign, CampaignType, CampaignStatus } from "@/lib/types";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // Form State
  const [campaignName, setCampaignName] = useState("");
  const [channelType, setChannelType] = useState<CampaignType>("EMAIL");
  const [validationError, setValidationError] = useState("");

  const handleOpenCreateModal = () => {
    setEditingCampaign(null);
    setCampaignName("");
    setChannelType("EMAIL");
    setValidationError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setCampaignName(campaign.name);
    setChannelType(campaign.type);
    setValidationError("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCampaign(null);
    setCampaignName("");
    setValidationError("");
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignName.trim()) {
      setValidationError("Campaign name is required");
      return;
    }

    if (editingCampaign) {
      // Edit mode
      setCampaigns(prev =>
        prev.map(c =>
          c.id === editingCampaign.id
            ? { ...c, name: campaignName, type: channelType, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } else {
      // Create mode
      const newCampaign: Campaign = {
        id: `c_${Date.now()}`,
        workspaceId: "ws_1",
        name: campaignName,
        type: channelType,
        status: "DRAFT",
        config: {
          schedule: "weekdays",
          sendTime: "09:00",
          timezone: "America/New_York",
          dailyLimit: 50,
        },
        totalLeads: 0,
        emailsSent: 0,
        opens: 0,
        clicks: 0,
        replies: 0,
        conversions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCampaigns(prev => [newCampaign, ...prev]);
    }

    handleCloseModal();
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus: CampaignStatus = c.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Campaign Manager</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your outreach campaigns</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          + New Campaign
        </button>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {campaigns.map((campaign, i) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              delay={i * 0.04}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteCampaign}
              onEdit={handleOpenEditModal}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Campaign Creation / Editing Overlay Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop shadow overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-6 shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
                  </h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-1 hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleSaveCampaign} className="space-y-4">
                {/* Campaign Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => {
                      setCampaignName(e.target.value);
                      if (e.target.value.trim()) setValidationError("");
                    }}
                    placeholder="e.g. SaaS Tech Founders Cold Outreach"
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all placeholder:text-[var(--text-muted)]"
                  />
                  {validationError && (
                    <p className="text-xs text-red-500 font-medium mt-0.5">{validationError}</p>
                  )}
                </div>

                {/* Channel Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    Channel Type
                  </label>
                  <select
                    value={channelType}
                    onChange={(e) => setChannelType(e.target.value as CampaignType)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all"
                  >
                    <option value="EMAIL">Email Outreach</option>
                    <option value="WHATSAPP">WhatsApp Outreach</option>
                    <option value="COMBINED">Multi-Touch (Email + WhatsApp)</option>
                  </select>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    {editingCampaign ? "Save Changes" : "Create Campaign"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
