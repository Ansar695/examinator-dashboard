"use client";

import React, { memo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TeacherDashboardChartPoint } from "@/types/teacher-dashboard";

type PapersTrendChartProps = {
  data: TeacherDashboardChartPoint[];
  height?: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-xs text-muted-foreground font-medium mb-1">
          {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="text-sm font-bold text-foreground">
            {payload[0].value} <span className="font-normal text-muted-foreground">Papers</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function PapersTrendChart({ data, height = 260 }: PapersTrendChartProps) {
  return (
    <div style={{ height }} className="w-full group">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="papersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="papersStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tickLine={false} 
            axisLine={false} 
            fontSize={11} 
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            minTickGap={40}
            className="text-muted-foreground"
          />
          <YAxis 
            allowDecimals={false} 
            tickLine={false} 
            axisLine={false} 
            fontSize={11} 
            width={40}
            className="text-muted-foreground"
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "5 5", opacity: 0.5 }} 
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="url(#papersStroke)" 
            fill="url(#papersFill)" 
            strokeWidth={3} 
            activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))", className: "animate-pulse" }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(PapersTrendChart);

