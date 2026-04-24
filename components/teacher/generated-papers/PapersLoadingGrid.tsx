"use client";

import { PaperGridSkeleton } from "@/components/skeletons/PaperGridSkeleton";

type PapersLoadingGridProps = {
  viewMode: "grid" | "list";
  count?: number;
};

export default function PapersLoadingGrid({ viewMode, count = 9 }: PapersLoadingGridProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <PaperGridSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PaperGridSkeleton key={i} />
      ))}
    </div>
  );
}

