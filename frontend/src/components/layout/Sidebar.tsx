"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, Database, FileText, Mail,
  MessageCircle, Megaphone, MessageSquare, Workflow,
  BarChart3, Bot, Plug, Settings, Sparkles, ChevronLeft,
  ChevronRight, User, LogOut, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store/useUIStore";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Search, label: "AI Lead Finder", href: "/leads/finder" },
  { icon: Database, label: "Lead Database", href: "/leads/database" },
  { icon: FileText, label: "Proposal Studio", href: "/proposals" },
  { icon: Mail, label: "Email Outreach", href: "/outreach/email" },
  { icon: MessageCircle, label: "WhatsApp Outreach", href: "/outreach/whatsapp" },
  { icon: Megaphone, label: "Campaign Manager", href: "/campaigns" },
  { icon: MessageSquare, label: "Response Tracker", href: "/responses" },
  { icon: Workflow, label: "Workflow Automation", href: "/automation" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bot, label: "AI Assistant", href: "#assistant" },
  { icon: Plug, label: "Integrations", href: "/integrations" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 64 },
};

const itemVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" },
  }),
};

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, toggleAIAssistant, userPlan } = useUIStore();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={sidebarCollapsed ? "collapsed" : "expanded"}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--border)] bg-white shadow-[2px_0_12px_rgba(0,0,0,0.04)]"
      style={{ overflow: "hidden" }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[var(--border)] px-4">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap font-bold text-[15px] gradient-text overflow-hidden"
              >
                MYOS AI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-hide">
        <div className="space-y-0.5 px-2">
          {navItems.map(({ icon: Icon, label, href }, i) => {
            const active = isActive(href);
            const isAssistant = href === "#assistant";

            const content = (
              <motion.div
                key={href}
                custom={i}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                whileHover={{ x: 2 }}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-blue-50 text-[var(--accent-blue)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
                )}
                onClick={isAssistant ? toggleAIAssistant : undefined}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent-blue)]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-all",
                    active ? "text-[var(--accent-blue)]" : "text-[var(--text-muted)] group-hover:scale-110 group-hover:text-[var(--text-secondary)]"
                  )}
                />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip on collapse */}
                {sidebarCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-2 hidden rounded-md bg-[var(--text-primary)] px-2 py-1 text-xs text-white shadow-lg group-hover:block whitespace-nowrap">
                    {label}
                  </div>
                )}
              </motion.div>
            );

            if (isAssistant) return <div key={href}>{content}</div>;
            return (
              <Link key={href} href={href}>
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: User + collapse */}
      <div className="border-t border-[var(--border)] p-2 space-y-1">
        {/* User row */}
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-[var(--surface)] cursor-pointer transition-colors">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">
            AC
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">Alex Chen</p>
                <p className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                  {userPlan === "FREE" ? "Free Tier" : `${userPlan.charAt(0) + userPlan.slice(1).toLowerCase()} Plan`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-secondary)]"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
