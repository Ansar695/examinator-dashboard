import { Skeleton } from "@/components/ui/skeleton"

export function UserTableSkeleton() {
  return (
    <div className="space-y-2 rounded-md border p-4">
      {/* Table Header */}
      <div className="grid grid-cols-7 items-center gap-4 border-b pb-2 text-sm font-medium text-muted-foreground">
        <div>User</div>
        <div>Email</div>
        <div>Role</div>
        <div>Status</div>
        <div>Phone</div>
        <div>Institution</div>
        <div>Actions</div>
      </div>

      {/* Table Rows */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-7 items-center gap-4 rounded-md border-b py-3"
        >
          {/* User */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Email */}
          <Skeleton className="h-4 w-40" />

          {/* Role */}
          <Skeleton className="h-5 w-16 rounded-full" />

          {/* Status */}
          <Skeleton className="h-5 w-16 rounded-full" />

          {/* Phone */}
          <Skeleton className="h-4 w-20" />

          {/* Institution */}
          <Skeleton className="h-4 w-24" />

          {/* Actions */}
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
      ))}
    </div>
  )
}
