// components/BoardPapers/BoardPapersGridSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function BoardPaperGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div
          key={index}
          className="relative h-full rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-card border border-border/50 rounded-2xl" />

          <div className="relative z-10 h-full flex flex-col">
            {/* Content section */}
            <div className="flex-1 p-6 flex flex-col">
              {/* Header with icon and title */}
              <div className="flex items-start gap-3 mb-4">
                <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0 mt-0.5" />
                <div className="flex-1 mb-5">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-auto border-t border-border/50">
                <Skeleton className="flex-1 h-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}