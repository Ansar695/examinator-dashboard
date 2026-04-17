"use client"

import { useMemo } from "react"
import StatCard from "./StatCard"
import RecentPapers from "./RecentPapers"
import { DashboardCardsSkeleton } from "../skeletons/DashboardSkeleton"
import type { TeacherDashboardData } from "@/types/teacher-dashboard"
import DashboardHeader from "./dashboard/DashboardHeader"
import DashboardAlerts from "./dashboard/DashboardAlerts"
import DashboardInsights from "./dashboard/DashboardInsights"
import DashboardCharts from "./dashboard/DashboardCharts"
import { useTeacherDashboardCards } from "@/hooks/useTeacherDashboardCards"

interface DashboardProps {
  isLoading: boolean;
  statsData?: TeacherDashboardData;
}

export default function Dashboard(props: DashboardProps) {
  const { isLoading, statsData } = props;
  const cards = useTeacherDashboardCards(statsData);
  const cardDelays = useMemo(() => cards.map((_, i) => i * 80), [cards]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        subtitle="Track your paper generation, quota health, and question bank coverage."
        primaryActionHref="/teacher/paper-builder"
        primaryActionLabel="Create New Paper"
      />

      <DashboardAlerts alerts={statsData?.alerts} isLoading={isLoading} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? 
        <>
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        </>
        : 
        <>
        {cards.map((card, index) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
            color={card.color}
            delay={cardDelays[index] ?? 0}
          />
        ))}
        </>
        }
      </div>

      <DashboardInsights
        isLoading={isLoading}
        stats={statsData?.stats}
        overview={statsData?.overview}
        bank={statsData?.bank}
      />

      <DashboardCharts isLoading={isLoading} charts={statsData?.charts} />

      <RecentPapers isLoading={isLoading} papers={statsData?.papers} />

      {/* Main Content */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">Generated Papers</h2>
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm hover:border-primary transition-colors"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
          <PapersTable />
        </div>

        <div className="animate-slide-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div> */}

    </div>
  )
}
