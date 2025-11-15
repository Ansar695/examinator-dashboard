"use client";

import { useEffect, useState } from "react";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { Toaster } from "@/components/ui/toaster";
import CustomPagination from "@/components/common/Pagination";
import {
  useGetBoardPapersQuery,
  useGetSubBoardsQuery,
} from "@/lib/api/boardPapersApi";
import { BoardPaperFilters } from "@/components/board-papers/BoardPaperFilters";
import BoardPapersList from "@/components/board-papers/BoardPapersList";
import { toast } from "@/components/ui/use-toast";
import { BoardPapersListSkeleton } from "@/components/skeletons/BoardPapersSkeleton";
import BoardPapersGridView from "@/components/board-papers/BoardPapersGridView";
import { BoardPaperGridSkeleton } from "@/components/skeletons/BoardPaperGridSkeleton";

export default function BoardsPapers() {
  const [filters, setFilters] = useState({ search: "", boardName: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [boardNames, setBoardNames] = useState([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: allPapers,
    isLoading,
    error,
  } = useGetBoardPapersQuery(filters ?? undefined);

  const { data: allNames, isLoading: boardLoading } = useGetSubBoardsQuery();

  const handleFilterChange = (newFilters: {
    search: string;
    boardName: string;
  }) => {
    setFilters(newFilters);
  };

  const meta = allPapers?.meta || {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  };

  useEffect(() => {
    if (allNames?.data?.length) {
      const transformed = allNames?.data?.map((da) => {
        return {
          name: da?.boardName,
          id: da?.boardName,
        };
      });
      setBoardNames(transformed as any);
    }
  }, [allNames]);

  if (error) {
    toast({
      title: "Error",
      description:
        "Error occured while fetching papers. Please check your internet connection.",
      variant: "destructive",
    });
    return (
      <div className="w-full flex items-center justify-center p-6">
        <p className="text-muted-foreground">No paper found.</p>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Board Papers Library
              </h1>
              <p className="text-muted-foreground">
                {allPapers?.meta?.total ?? 0}{" "}
                {allPapers?.meta?.total === 1 ? "Board Paper" : "Board Papers"}{" "}
                available
              </p>
            </div>
          </div>

          <BoardPaperFilters
            boardNames={boardNames ?? []}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Notes List */}
        {isLoading ? (
          <BoardPaperGridSkeleton />
        ) : viewMode === "list" ? (
          <BoardPapersList
            boardPapers={allPapers?.data ?? []}
            isAdmin={false}
          />
        ) : (
          <BoardPapersGridView
            boardPapers={allPapers?.data ?? []}
            isAdmin={false}
          />
        )}
        {/* Pagination */}
        {meta?.totalPages > 1 && (
          <CustomPagination
            totalPages={meta?.totalPages ?? 1}
            currentUsers={allPapers?.data?.length ?? 0}
            currentPage={currentPage}
            limit={meta?.limit ?? 20}
            total={meta?.total ?? 0}
            onPageChange={(p: number) => setCurrentPage(p)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
