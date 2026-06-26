"use client";

import { leadSourceBreakdown } from "@/lib/mock-data/analytics";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function LeadSourcePanel() {
  return (
    <div className="card flex flex-col gap-4 p-5">
      <div>
        <h3 className="font-semibold text-[var(--text-primary)]">Lead Sources</h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Where your leads are coming from</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={leadSourceBreakdown}
            dataKey="count"
            nameKey="source"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            isAnimationActive
            animationDuration={800}
          >
            {leadSourceBreakdown.map((entry) => (
              <Cell key={entry.source} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
