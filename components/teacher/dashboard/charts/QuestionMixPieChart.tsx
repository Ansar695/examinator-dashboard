"use client";

import React, { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type MixItem = { name: string; value: number };

const COLORS = ["#2563eb", "#16a34a", "#f97316"];

type QuestionMixPieChartProps = {
  data: MixItem[];
  height?: number;
};

function QuestionMixPieChart({ data, height = 240 }: QuestionMixPieChartProps) {
  const total = data.reduce((sum, x) => sum + x.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={{ borderRadius: 10, borderColor: "hsl(var(--border))" }} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Last 30 days</p>
        <p className="text-2xl font-bold text-foreground">{total.toLocaleString()} questions</p>
        <div className="space-y-2 pt-2">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-foreground">{d.name}</span>
              </div>
              <span className="text-muted-foreground">{d.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(QuestionMixPieChart);

