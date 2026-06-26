"use client";

import { create } from "zustand";
import { mockLeads } from "@/lib/mock-data/leads";
import type { Lead, LeadStage } from "@/lib/types";

export type ViewMode = "kanban" | "table";

interface LeadFilters {
  stage?: LeadStage;
  source?: string;
  search?: string;
  tags?: string[];
}

interface LeadStore {
  // State
  leads: Lead[];
  selectedLeadIds: string[];
  viewMode: ViewMode;
  filters: LeadFilters;
  isSearching: boolean;
  searchResults: Lead[];

  // Actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  removeLead: (id: string) => void;
  selectLead: (id: string) => void;
  deselectLead: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setViewMode: (mode: ViewMode) => void;
  setFilter: (filters: Partial<LeadFilters>) => void;
  clearFilters: () => void;
  setSearching: (value: boolean) => void;
  setSearchResults: (leads: Lead[]) => void;
  getLeadsByStage: (stage: LeadStage) => Lead[];
  filteredLeads: () => Lead[];
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: mockLeads,
  selectedLeadIds: [],
  viewMode: "kanban",
  filters: {},
  isSearching: false,
  searchResults: [],

  setLeads: (leads) => set({ leads }),

  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),

  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l)),
    })),

  updateLeadStage: (id, stage) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id ? { ...l, stage, updatedAt: new Date().toISOString() } : l
      ),
    })),

  removeLead: (id) =>
    set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),

  selectLead: (id) =>
    set((state) => ({
      selectedLeadIds: state.selectedLeadIds.includes(id)
        ? state.selectedLeadIds
        : [...state.selectedLeadIds, id],
    })),

  deselectLead: (id) =>
    set((state) => ({
      selectedLeadIds: state.selectedLeadIds.filter((sid) => sid !== id),
    })),

  selectAll: () =>
    set((state) => ({ selectedLeadIds: state.leads.map((l) => l.id) })),

  clearSelection: () => set({ selectedLeadIds: [] }),

  setViewMode: (viewMode) => set({ viewMode }),

  setFilter: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  clearFilters: () => set({ filters: {} }),

  setSearching: (isSearching) => set({ isSearching }),

  setSearchResults: (searchResults) => set({ searchResults }),

  getLeadsByStage: (stage) => get().leads.filter((l) => l.stage === stage && !l.isArchived),

  filteredLeads: () => {
    const { leads, filters } = get();
    return leads.filter((lead) => {
      if (lead.isArchived) return false;
      if (filters.stage && lead.stage !== filters.stage) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !lead.company.toLowerCase().includes(q) &&
          !lead.contactName?.toLowerCase().includes(q) &&
          !lead.email?.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.tags?.length) {
        if (!filters.tags.some((t) => lead.tags.includes(t))) return false;
      }
      return true;
    });
  },
}));
