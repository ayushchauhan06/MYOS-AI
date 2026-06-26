"use client";

import { create } from "zustand";
import { mockCampaigns } from "@/lib/mock-data/campaigns";
import type { Campaign, CampaignStatus } from "@/lib/types";

interface CampaignStore {
  campaigns: Campaign[];
  activeCampaignId: string | null;

  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  updateCampaignStatus: (id: string, status: CampaignStatus) => void;
  deleteCampaign: (id: string) => void;
  setActiveCampaign: (id: string | null) => void;
  getActiveCampaign: () => Campaign | undefined;
  getCampaignsByStatus: (status: CampaignStatus) => Campaign[];
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: mockCampaigns,
  activeCampaignId: null,

  setCampaigns: (campaigns) => set({ campaigns }),

  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [campaign, ...state.campaigns] })),

  updateCampaign: (id, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    })),

  updateCampaignStatus: (id, status) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    })),

  deleteCampaign: (id) =>
    set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) })),

  setActiveCampaign: (activeCampaignId) => set({ activeCampaignId }),

  getActiveCampaign: () => {
    const { campaigns, activeCampaignId } = get();
    return campaigns.find((c) => c.id === activeCampaignId);
  },

  getCampaignsByStatus: (status) =>
    get().campaigns.filter((c) => c.status === status),
}));
