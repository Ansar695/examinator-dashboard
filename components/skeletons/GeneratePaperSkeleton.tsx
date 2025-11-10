import { Skeleton } from "@/components/ui/skeleton"

export function GeneratePaperSkeleton() {
  return (
    <div className="p-5 border-b border-sidebar-border bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-40" />
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
        <Skeleton className="h-3 w-10 mb-3" />
        <Skeleton className="h-3 w-20 mb-3" />
      <div className="w-full flex items-center justify-between gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>
    </div>
  )
}
