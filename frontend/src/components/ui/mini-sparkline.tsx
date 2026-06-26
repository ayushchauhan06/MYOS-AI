"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function MiniSparkline({ data, color = "#2563EB", height = 36 }: MiniSparklineProps) {
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
