import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflow Automation — MYOS AI",
  description: "Build powerful automated outreach workflows with visual drag-and-drop.",
};

export default function AutomationPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Workflow Automation</h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Build automated outreach sequences visually</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
          + New Workflow
        </button>
      </div>

      {/* Example workflow card */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">SaaS Founder Sequence</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Active · 142 leads enrolled</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">Edit</button>
            <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">Running ▶</button>
          </div>
        </div>

        {/* Visual flow */}
        <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { type: "trigger", label: "Lead Found", color: "bg-blue-100 border-blue-300 text-blue-800" },
            { type: "action", label: "Generate Email", color: "bg-violet-100 border-violet-300 text-violet-800" },
            { type: "condition", label: "Email Opened?", color: "bg-amber-100 border-amber-300 text-amber-800", diamond: true },
            { type: "delay", label: "Wait 3 Days", color: "bg-gray-100 border-gray-300 text-gray-700" },
            { type: "action", label: "Send Follow-up", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
            { type: "end", label: "Book Meeting", color: "bg-teal-100 border-teal-300 text-teal-800" },
          ].map(({ type, label, color, diamond }, i, arr) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className={`relative flex items-center justify-center border-2 px-4 py-2.5 text-xs font-semibold text-center ${diamond ? "rotate-45 w-16 h-16" : "rounded-xl min-w-[120px]"} ${color}`}>
                <span className={diamond ? "-rotate-45" : ""}>{label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="flex items-center gap-0.5 mx-1">
                  <div className="h-0.5 w-6 border-t-2 border-dashed border-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)] text-xs">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
