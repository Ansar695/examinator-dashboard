"use client";

import React, { memo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";
import type { DashboardActivity } from "@/types/teacher-dashboard";

type RecentActivityProps = {
  activities?: DashboardActivity[];
  isLoading?: boolean;
};

function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <Card className="p-6 border-0 shadow-sm bg-white h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground font-sans">Recent activity</h2>
      </div>

      <div className="flex-1 space-y-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <Skeleton className="w-1.5 h-1.5 rounded-full mt-2" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-2 w-1/2 rounded" />
              </div>
            </div>
          ))
        ) : activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex gap-4 group animate-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Dot Indicator */}
              <div className="relative mt-2 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "PLAN_SUBSCRIBED" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                }`} />
                {index !== (activities.length - 1) && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-10 bg-border/40" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {activity.type === "PAPER_GENERATED" ? "Generation" : "Account"} — {activity.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {activity.description}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium tracking-tight">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <Activity className="w-10 h-10 mb-2" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>

      <button className="mt-6 text-xs text-primary font-semibold hover:underline w-full text-center">
        View all activity
      </button>
    </Card>
  );
}

export default memo(RecentActivity);
