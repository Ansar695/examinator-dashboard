import { Skeleton } from "@/components/ui/skeleton";

export function BoardPapersListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className="flex items-start justify-between p-4 border border-border rounded-lg"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-12 flex-shrink-0" />
              </div>
              <Skeleton className="h-4 w-64 mb-2" />
              <div className="flex items-center gap-3 mt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}