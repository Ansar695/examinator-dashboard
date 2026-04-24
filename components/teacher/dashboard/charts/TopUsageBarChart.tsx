"use client";

import React, { memo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

type TopUsageItem = { name: string; count: number };

type TopUsageBarChartProps = {
  data: TopUsageItem[];
  height?: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
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

function TopUsageBarChart({ data, height = 260 }: TopUsageBarChartProps) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            interval={0}
            height={60}
            className="text-muted-foreground font-medium"
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y})`}>
                <text 
                  x={0} 
                  y={0} 
                  dy={16} 
                  textAnchor="end" 
                  fill="currentColor" 
                  transform="rotate(-35)" 
                  className="text-[10px] md:text-[11px]"
                >
                  {payload.value}
                </text>
              </g>
            )}
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
            cursor={{ fill: "hsl(var(--primary))", opacity: 0.05, radius: 10 }} 
          />
          <Bar 
            dataKey="count" 
            radius={[6, 6, 0, 0]} 
            barSize={32}
            animationDuration={1500}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="url(#barGradient)" 
                className="hover:opacity-80 transition-opacity cursor-pointer" 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(TopUsageBarChart);

