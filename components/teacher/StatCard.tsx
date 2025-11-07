"use client"

import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend: string
  color: string
  delay: number
}

export default function StatCard({ title, value, icon: Icon, trend, color, delay }: StatCardProps) {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group animate-slide-in-up border-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-foreground mt-2 capitalize">{value}</h3>
          <p className="text-xs text-muted-foreground mt-2">{trend}</p>
        </div>
        <div
          className={`bg-gradient-to-br ${color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </Card>
  )
}
