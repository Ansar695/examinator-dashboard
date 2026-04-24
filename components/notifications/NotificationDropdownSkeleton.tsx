"use client";

import { cn } from "@/lib/utils";

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-3 rounded-full bg-muted/70", className)} />;
}

export function NotificationDropdownSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="p-4">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="flex gap-3 rounded-xl border bg-background p-3 shadow-sm"
          >
            <div className="h-10 w-10 rounded-xl bg-muted/70 animate-pulse" />
            <div className="flex-1 space-y-2">
              <SkeletonLine className="w-2/3 animate-pulse" />
              <SkeletonLine className="w-full animate-pulse" />
              <SkeletonLine className="w-1/2 animate-pulse" />
              <div className="pt-1">
                <div className="h-5 w-16 rounded-md bg-muted/70 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

