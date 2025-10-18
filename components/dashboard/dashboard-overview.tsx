"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, GraduationCap, Library, FileText, Plus, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface DashboardStats {
  boards: {
    count: number
    change: string
    changeType: "positive" | "negative"
  }
  classes: {
    count: number
    change: string
    changeType: "positive" | "negative"
  }
  subjects: {
    count: number
    change: string
    changeType: "positive" | "negative"
  }
  chapters: {
    count: number
    change: string
    changeType: "positive" | "negative"
  }
}

interface RecentActivity {
  id: string
  type: "board" | "chapter" | "subject"
  title: string
  createdAt: string
}

interface DashboardData {
  stats: DashboardStats
  recentActivities: RecentActivity[]
}

const quickActions = [
  {
    title: "Add New Board",
    description: "Create a new educational board",
    href: "/admin/boards",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    title: "Add Class",
    description: "Add a new class to existing board",
    href: "/admin/classes",
    icon: GraduationCap,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    hoverColor: "hover:bg-emerald-100",
  },
  {
    title: "Add Subject",
    description: "Create a new subject for classes",
    href: "/admin/subjects",
    icon: Library,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
  },
  {
    title: "Upload Chapter",
    description: "Upload PDF chapters for subjects",
    href: "/admin/chapters",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
  },
]

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const stats = data
    ? [
        {
          name: "Total Boards",
          value: data.stats.boards.count.toString(),
          change: data.stats.boards.change,
          changeType: data.stats.boards.changeType,
          icon: BookOpen,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        },
        {
          name: "Active Classes",
          value: data.stats.classes.count.toString(),
          change: data.stats.classes.change,
          changeType: data.stats.classes.changeType,
          icon: GraduationCap,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
        },
        {
          name: "Subjects",
          value: data.stats.subjects.count.toString(),
          change: data.stats.subjects.change,
          changeType: data.stats.subjects.changeType,
          icon: Library,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
        },
        {
          name: "Chapters",
          value: data.stats.chapters.count.toLocaleString(),
          change: data.stats.chapters.change,
          changeType: data.stats.chapters.changeType,
          icon: FileText,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
        },
      ]
    : []

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "board":
        return { icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-100" }
      case "chapter":
        return { icon: FileText, color: "text-emerald-600", bgColor: "bg-emerald-100" }
      case "subject":
        return { icon: Library, color: "text-purple-600", bgColor: "bg-purple-100" }
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-6">
          <CardContent>
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome to your educational content management system</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="relative overflow-hidden border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card
                key={stat.name}
                className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="mr-2 h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">{stat.change}</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="space-y-4">
                <div
                  className={`w-12 h-12 rounded-xl ${action.bgColor} ${action.hoverColor} flex items-center justify-center transition-colors group-hover:scale-110 duration-200`}
                >
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {action.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                  <Link href={action.href}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-foreground">Recent Activity</CardTitle>
          <CardDescription className="text-muted-foreground">
            Latest updates across your educational content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.recentActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>
          ) : (
            <div className="space-y-4">
              {data?.recentActivities.map((activity) => {
                const iconData = getActivityIcon(activity.type)
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconData.bgColor}`}>
                      <iconData.icon className={`h-5 w-5 ${iconData.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
