import { Skeleton } from "@/components/ui/skeleton"

export function DashboardCardsSkeleton() {
  return (
    <div className="p-6 border-b border-sidebar-border bg-white shadow-md rounded-lg">
      <div className="w-full flex items-start justify-center gap-3 mb-2">

        <div className="w-full flex flex-col gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
      </div>
    </div>
  )
}
