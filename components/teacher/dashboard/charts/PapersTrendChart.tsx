"use client";

import React, { memo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TeacherDashboardChartPoint } from "@/types/teacher-dashboard";

type PapersTrendChartProps = {
  data: TeacherDashboardChartPoint[];
  height?: number;
};

function PapersTrendChart({ data, height = 260 }: PapersTrendChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="papersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
          <Tooltip
            cursor={{ stroke: "hsl(var(--primary))", strokeOpacity: 0.2 }}
            contentStyle={{ borderRadius: 10, borderColor: "hsl(var(--border))" }}
          />
          <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#papersFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(PapersTrendChart);

