import { Skeleton } from "@/components/ui/skeleton"

export function SidebarLogoSkeleton() {
  return (
    <div className="p-6 border-b border-sidebar-border">
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />

        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}
