"use client";

import React, { memo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TopUsageItem = { name: string; count: number };

type TopUsageBarChartProps = {
  data: TopUsageItem[];
  height?: number;
  barColor?: string;
};

function TopUsageBarChart({
  data,
  height = 260,
  barColor = "hsl(var(--primary))",
}: TopUsageBarChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={44}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
          <Tooltip
            cursor={{ fill: "hsl(var(--primary))", opacity: 0.08 }}
            contentStyle={{ borderRadius: 10, borderColor: "hsl(var(--border))" }}
          />
          <Bar dataKey="count" fill={barColor} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(TopUsageBarChart);

