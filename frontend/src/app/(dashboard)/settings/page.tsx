import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — MYOS AI",
  description: "Manage your MYOS AI profile, workspace, AI settings, and billing.",
};

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your account, workspace, and AI preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold text-white">AC</div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">Alex Chen</p>
            <p className="text-sm text-[var(--text-muted)]">alex@myos.ai</p>
          </div>
          <button className="ml-auto rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
            Edit Profile
          </button>
        </div>
        {[
          { label: "Full Name", value: "Alex Chen" },
          { label: "Email", value: "alex@myos.ai" },
          { label: "Timezone", value: "America/New_York (EST)" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
          </div>
        ))}
      </div>

      {/* AI Settings */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">AI Settings</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">AI Model</label>
          <select className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-blue)] transition-all">
            <option>GPT-4o (OpenAI)</option>
            <option>Claude Sonnet (Anthropic)</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Email Tone</label>
          <div className="flex gap-2">
            {["Professional", "Casual", "Friendly"].map((tone) => (
              <button key={tone} className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors ${tone === "Professional" ? "border-[var(--accent-blue)] bg-blue-50 text-blue-700" : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]"}`}>
                {tone}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Creativity (Temperature)</label>
            <span className="text-xs font-bold text-[var(--accent-blue)]">0.7</span>
          </div>
          <input type="range" min={0} max={1} step={0.1} defaultValue={0.7} className="w-full accent-[var(--accent-blue)]" />
        </div>
      </div>

      {/* Billing */}
      <div className="card p-6 space-y-4">
        <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-3">Billing</h3>
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white">
          <p className="text-sm font-semibold opacity-80">Current Plan</p>
          <p className="text-2xl font-bold mt-1">Pro Plan</p>
          <p className="text-sm opacity-70 mt-1">$79/mo · Renews July 26, 2026</p>
        </div>
        <button className="w-full rounded-xl border border-[var(--border)] bg-white py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
          Manage Billing
        </button>
      </div>
    </div>
  );
}
