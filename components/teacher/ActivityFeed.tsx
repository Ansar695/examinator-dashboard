"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Plus } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "created",
    title: "Paper Created",
    description: "Mathematics Final Exam",
    time: "2 hours ago",
    icon: Plus,
  },
  {
    id: 2,
    type: "published",
    title: "Paper Published",
    description: "Physics Midterm",
    time: "5 hours ago",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "created",
    title: "Paper Created",
    description: "English Literature",
    time: "1 day ago",
    icon: Plus,
  },
  {
    id: 4,
    type: "warning",
    title: "Quota Warning",
    description: "You have 7 papers left",
    time: "2 days ago",
    icon: AlertCircle,
  },
  {
    id: 5,
    type: "published",
    title: "Paper Published",
    description: "Chemistry Quiz",
    time: "3 days ago",
    icon: CheckCircle,
  },
]

export default function ActivityFeed() {
  return (
    <Card className="p-6 border-0 space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon
        const iconColor =
          activity.type === "created"
            ? "text-blue-500"
            : activity.type === "published"
              ? "text-green-500"
              : "text-orange-500"

        return (
          <div
            key={activity.id}
            className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0 animate-slide-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${iconColor}`}
            >
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        )
      })}
    </Card>
  )
}
