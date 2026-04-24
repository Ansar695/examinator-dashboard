"use client";

import React, { memo, useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type TrendData = { date: string; count: number };

type TrendChartProps = {
  dailyData: TrendData[];
  monthlyData: TrendData[];
  isLoading?: boolean;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="text-sm font-bold text-foreground">
            {payload[0].value} <span className="font-normal text-muted-foreground ml-0.5">Papers</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function TrendChart({ dailyData, monthlyData, isLoading }: TrendChartProps) {
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">("monthly");

  const currentData = useMemo(() => {
    if (filter === "monthly") return monthlyData;
    if (filter === "daily") return dailyData;
    // Weekly: Just a subset or grouped daily data for now
    return dailyData.slice(-7);
  }, [filter, dailyData, monthlyData]);

  const filterLabel = useMemo(() => {
    if (filter === "daily") return "Daily (Last 30 days)";
    if (filter === "weekly") return "Weekly (Last 7 days)";
    return "Monthly (Last 12 months)";
  }, [filter]);

  return (
    <Card className="p-6 border-0 shadow-sm bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">Paper trend</h2>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">Range</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            {filter === "monthly" 
              ? "Monthly: Jan–Dec this year (0 if none). Year: last twelve months (UTC)."
              : filter === "weekly"
              ? "Weekly: Last 7 active days of paper generation activity."
              : "Daily: Last 30 days of individual paper generation performance."}
          </p>
        </div>

        <div className="relative inline-block text-left">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="appearance-none bg-background border border-border px-4 py-2 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary transition-all cursor-pointer min-w-[160px]"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="h-full w-full">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                fontSize={10}
                className="text-muted-foreground font-medium"
                dy={10}
                interval={filter === "daily" ? 4 : 0}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={10}
                className="text-muted-foreground font-medium"
                width={40}
                dx={-5}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                  opacity: 0.5,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="url(#trendStroke)"
                fill="url(#trendFill)"
                strokeWidth={3}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#fff",
                  fill: "hsl(var(--primary))",
                  className: "shadow-lg",
                }}
                animationDuration={1500}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  stroke: "#fff",
                  fill: "hsl(var(--primary))",
                  fillOpacity: 1,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export default memo(TrendChart);
