"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AllocationSlice } from "@/lib/types";

type Props = {
  data: AllocationSlice[];
};

export function AssetAllocationPie({ data }: Props) {
  const chartData = data.map((d) => ({ name: d.name, value: d.value, color: d.color }));
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
            stroke="rgba(15,23,42,0.9)"
            strokeWidth={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 12,
            }}
            formatter={(value) => [`${value ?? 0}%`, "Allocation"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
