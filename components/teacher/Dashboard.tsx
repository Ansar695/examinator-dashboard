"use client"

import { useState } from "react"
import { Plus, TrendingUp, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import StatCard from "./StatCard"
import RecentPapers from "./RecentPapers"
import CreatePaperModal from "./CreatePaperModal"
import { DashboardCardsSkeleton } from "../skeletons/DashboardSkeleton"
import Link from "next/link"

interface DashboardProps {
  isLoading: boolean;
  statsData: any;
}

export default function Dashboard(props: DashboardProps) {
  const { isLoading, statsData } = props;
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-in-up">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
        </div>
        <Link href="/select-board">
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          Create New Paper
        </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? 
        <>
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        <DashboardCardsSkeleton />
        </>
        : 
        <>
        <StatCard
          title="Total Papers"
          value={statsData?.stats?.totalPaper ?? 0}
          icon={FileText}
          trend="+3 this month"
          color="from-blue-500 to-blue-600"
          delay={0}
        />
        <StatCard
          title="Papers Generated"
          value={statsData?.stats?.usedPaper ?? 0}
          icon={TrendingUp}
          trend={`${statsData?.stats?.usedPercentage ?? 0}% of monthly quota`}
          color="from-purple-500 to-purple-600"
          delay={100}
        />
        <StatCard
          title="Remaining"
          value={statsData?.stats?.remainingPaper ?? 0}
          icon={Zap}
          trend="Resets on Nov 1"
          color="from-green-500 to-green-600"
          delay={200}
        />
        <StatCard
          title="Plan Type"
          value={statsData?.stats?.currentPlan?.toLowerCase() ?? 'free'}
          icon={FileText}
          trend="Expires Dec 15"
          color="from-orange-500 to-orange-600"
          delay={300}
        />
        </>
        }
      </div>

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

      {/* Create Paper Modal */}
      {showCreateModal && <CreatePaperModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
