"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, GraduationCap, Library, FileText, Plus, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    name: "Total Boards",
    value: "12",
    change: "+2.1%",
    changeType: "positive",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Active Classes",
    value: "48",
    change: "+5.4%",
    changeType: "positive",
    icon: GraduationCap,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    name: "Subjects",
    value: "156",
    change: "+12.5%",
    changeType: "positive",
    icon: Library,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    name: "Chapters",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const quickActions = [
  {
    title: "Add New Board",
    description: "Create a new educational board",
    href: "/boards",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    title: "Add Class",
    description: "Add a new class to existing board",
    href: "/classes",
    icon: GraduationCap,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    hoverColor: "hover:bg-emerald-100",
  },
  {
    title: "Add Subject",
    description: "Create a new subject for classes",
    href: "/subjects",
    icon: Library,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
  },
  {
    title: "Upload Chapter",
    description: "Upload PDF chapters for subjects",
    href: "/chapters",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome to your educational content management system</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">New board "CBSE 2024" created</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">Chapter "Introduction to Physics" uploaded</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>4 hours ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Library className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Subject "Advanced Mathematics" added to Class 12
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
