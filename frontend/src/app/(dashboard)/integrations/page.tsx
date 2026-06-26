import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Mail, MessageCircle, Link2, Globe, CheckCircle, XCircle } from "lucide-react";


export const metadata: Metadata = {
  title: "Integrations — MYOS AI",
  description: "Connect your tools to MYOS AI to automate your entire sales workflow.",
};

const integrations = [
  { id: "gmail", name: "Gmail", description: "Send emails directly from your Gmail account", icon: Mail, color: "text-red-500", bg: "bg-red-50", status: "connected" },
  { id: "whatsapp", name: "WhatsApp Business", description: "Send WhatsApp messages via Meta Business API", icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50", status: "disconnected" },
  { id: "linkedin", name: "LinkedIn", description: "Enenrich lead profiles with LinkedIn data", icon: Link2, color: "text-blue-700", bg: "bg-blue-50", status: "disconnected" },
  { id: "stripe", name: "Stripe", description: "Track payments and revenue from proposals", icon: Globe, color: "text-violet-600", bg: "bg-violet-50", status: "connected" },
  { id: "apollo", name: "Apollo.io", description: "Import leads from Apollo's 200M+ database", icon: Globe, color: "text-amber-600", bg: "bg-amber-50", status: "disconnected" },
  { id: "outlook", name: "Outlook", description: "Send emails from your Microsoft Outlook account", icon: Mail, color: "text-blue-600", bg: "bg-blue-50", status: "error" },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Integrations</h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Connect your tools to automate your workflow</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map(({ id, name, description, icon: Icon, color, bg, status }) => (
          <div key={id} className="card flex flex-col gap-4 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-6 w-6", color)} />
              </div>
              <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                status === "connected" ? "bg-emerald-50 text-emerald-700" :
                status === "error" ? "bg-red-50 text-red-600" :
                "bg-gray-100 text-gray-500"
              )}>
                {status === "connected" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{name}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{description}</p>
            </div>
            <button className={cn("w-full rounded-xl py-2 text-sm font-semibold transition-all",
              status === "connected"
                ? "border border-red-200 text-red-600 hover:bg-red-50"
                : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-md hover:scale-[1.01]"
            )}>
              {status === "connected" ? "Disconnect" : status === "error" ? "Reconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
