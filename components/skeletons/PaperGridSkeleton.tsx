import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PaperGridSkeleton = () => (
  <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
    {/* Decorative corner accent skeleton */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 dark:bg-gray-900 rounded-bl-full transform translate-x-16 -translate-y-16 opacity-50" />

    <CardHeader className="relative pb-0">
      {/* Header with class badge and marks skeleton */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Title skeleton */}
      <div className="space-y-2 mb-1">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>

      {/* Meta information skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </CardHeader>

    <CardContent className="relative pb-0">
      {/* Question type cards skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-2">
        {/* MCQs skeleton */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4 border-2 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center text-center gap-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Short Questions skeleton */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-2 border-2 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center text-center gap-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        {/* Long Questions skeleton */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900 p-2 border-2 border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center text-center gap-2">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>

      {/* Total summary bar skeleton */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-12" />
      </div>
    </CardContent>

    <CardFooter className="relative pt-0 flex flex-col gap-3">
      {/* Primary action button skeleton */}
      <Skeleton className="h-9 w-full rounded-md" />

      {/* Secondary actions skeleton */}
      <div className="flex gap-2 w-full">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </CardFooter>
  </Card>
);
