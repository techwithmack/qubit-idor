"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PortfolioPoint } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type Props = {
  data: PortfolioPoint[];
};

export function PortfolioLineChart({ data }: Props) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${Math.round(v / 1000)}k`
            }
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: 12,
            }}
            labelStyle={{ color: "#e2e8f0" }}
            formatter={(value) => [
              formatCurrency(Number(value ?? 0)),
              "Value",
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
