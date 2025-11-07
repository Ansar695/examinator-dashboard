import { Skeleton } from "@/components/ui/skeleton"

export function DashboardCardsSkeleton() {
  return (
    <div className="p-6 border-b border-sidebar-border bg-white shadow-md">
      <div className="w-full flex items-center justify-center gap-3 mb-2">

        <div className="flex-1 mt-4">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
      </div>
    </div>
  )
}
