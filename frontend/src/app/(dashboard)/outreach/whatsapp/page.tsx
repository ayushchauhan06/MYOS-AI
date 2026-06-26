import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WhatsApp Outreach — MYOS AI",
  description: "Send personalized WhatsApp messages to your leads.",
};

export default function WhatsAppPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">WhatsApp Outreach</h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Send AI-crafted WhatsApp messages to leads</p>
      </div>
      <div className="card p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[300px]">
        <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl">
          💬
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">WhatsApp Composer</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm">
            Connect your WhatsApp Business account in Integrations to start sending personalized messages.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
          Connect WhatsApp
        </button>
      </div>
    </div>
  );
}
