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
}

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
}));
