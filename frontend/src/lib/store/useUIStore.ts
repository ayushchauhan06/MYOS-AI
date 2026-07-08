"use client";

import { create } from "zustand";
import { mockNotifications } from "@/lib/mock-data/analytics";
import type { Notification } from "@/lib/types";

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;

  // Notification panel
  notificationPanelOpen: boolean;
  toggleNotificationPanel: () => void;
  closeNotificationPanel: () => void;

  // AI Assistant
  aiAssistantOpen: boolean;
  toggleAIAssistant: () => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (notification: Notification) => void;

  // Command palette
  commandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Plan and Upgrades
  userPlan: "FREE" | "STARTER" | "PRO" | "AGENCY";
  setUserPlan: (plan: "FREE" | "STARTER" | "PRO" | "AGENCY") => void;
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
}

// Helper to get initial plan safely on client/server
const getInitialPlan = (): "FREE" | "STARTER" | "PRO" | "AGENCY" => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("myos_user_plan");
    if (saved === "FREE" || saved === "STARTER" || saved === "PRO" || saved === "AGENCY") {
      return saved;
    }
  }
  return "FREE";
};

// Helper to get initial theme safely on client/server
const getInitialTheme = (): "light" | "dark" | "system" => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("myos_theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  }
  return "system";
};

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  notificationPanelOpen: false,
  toggleNotificationPanel: () =>
    set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
  closeNotificationPanel: () => set({ notificationPanelOpen: false }),

  aiAssistantOpen: false,
  toggleAIAssistant: () =>
    set((state) => ({ aiAssistantOpen: !state.aiAssistantOpen })),

  notifications: mockNotifications as Notification[],
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.read ? 0 : 1),
    })),

  commandPaletteOpen: false,
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  userPlan: getInitialPlan(),
  setUserPlan: (userPlan) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("myos_user_plan", userPlan);
    }
    set({ userPlan });
  },
  upgradeModalOpen: false,
  setUpgradeModalOpen: (upgradeModalOpen) => set({ upgradeModalOpen }),

  theme: getInitialTheme(),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("myos_theme", theme);
    }
    set({ theme });
  },
  toggleTheme: () => {
    const currentTheme = get().theme;
    let nextTheme: "light" | "dark" | "system" = "light";
    if (currentTheme === "system") {
      const isSystemDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
      nextTheme = isSystemDark ? "light" : "dark";
    } else {
      nextTheme = currentTheme === "dark" ? "light" : "dark";
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("myos_theme", nextTheme);
    }
    set({ theme: nextTheme });
  },
}));
