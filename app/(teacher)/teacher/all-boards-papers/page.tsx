"use client";

import { useEffect, useState, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import CustomPagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import {
  useGetBoardPapersQuery,
  useGetSubBoardsQuery,
} from "@/lib/api/boardPapersApi";
import { BoardPaperFilters } from "@/components/board-papers/BoardPaperFilters";
import BoardPapersList from "@/components/board-papers/BoardPapersList";
import { BoardPapersListSkeleton } from "@/components/skeletons/BoardPapersSkeleton";
import BoardPapersGridView from "@/components/board-papers/BoardPapersGridView";
import { BoardPaperGridSkeleton } from "@/components/skeletons/BoardPaperGridSkeleton";
import PaperViewerModal from "@/components/board-papers/PaperViewerModal";
import { BookOpen } from "lucide-react";
import { BoardPaper } from "@/lib/api/boardPapersApi";

export default function BoardsPapers() {
  const [filters, setFilters] = useState({ search: "", boardName: "all", boardYear: "all" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [boardNames, setBoardNames] = useState([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedPaperView, setSelectedPaperView] = useState<BoardPaper | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {
    data: allPapers,
    isLoading,
    error,
  } = useGetBoardPapersQuery(filters ?? undefined);

  const { data: allNames, isLoading: boardLoading } = useGetSubBoardsQuery();

  const handleFilterChange = (newFilters: {
    search: string;
    boardName: string;
    boardYear: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewPaper = (paper: BoardPaper) => {
    setSelectedPaperView(paper);
    setIsViewerOpen(true);
  };

  const meta = allPapers?.meta || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  useEffect(() => {
    if (allNames?.data?.length) {
      const transformed = allNames?.data?.map((da) => ({
        name: da?.boardName,
        id: da?.boardName,
      }));
      setBoardNames(transformed as any);
    }
  }, [allNames]);

  if (error && !isLoading) {
    toast({
      title: "Error",
      description:
        "An error occurred while fetching papers. Please check your connection.",
      variant: "destructive",
    });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,hsl(var(--primary))/0.12,transparent_55%),radial-gradient(900px_circle_at_100%_40%,hsl(38_92%_50%)/0.10,transparent_45%)] p-4 sm:p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 backdrop-blur-md rounded-2xl p-6 md:px-8 md:py-6 border border-border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight mb-2">
              Board Papers Library
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Explore, download, and review standard curriculum board papers.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-background/50 px-5 py-3 rounded-xl border border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {isLoading ? "..." : meta?.total ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total Papers
              </p>
            </div>
          </div>
        </div>

        <BoardPaperFilters
          boardNames={boardNames ?? []}
          onFilterChange={handleFilterChange}
          isLoading={isLoading || boardLoading}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Papers Display area */}
        {isLoading ? (
          viewMode === "list" ? (
             <BoardPapersListSkeleton />
          ) : (
             <BoardPaperGridSkeleton />
          )
        ) : error && !isLoading ? (
          <div className="flex items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground font-medium">Failed to load board papers.</p>
          </div>
        ) : (
          viewMode === "list" ? (
            <BoardPapersList
              boardPapers={allPapers?.data ?? []}
              isAdmin={false}
              onViewPaper={handleViewPaper}
            />
          ) : (
            <BoardPapersGridView
              boardPapers={allPapers?.data ?? []}
              isAdmin={false}
              onViewPaper={handleViewPaper}
            />
          )
        )}

        {/* Pagination wrapper */}
        {meta?.totalPages > 1 && !isLoading && (
          <Card className="mt-6 border-none shadow-sm bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CustomPagination
              totalPages={meta?.totalPages ?? 1}
              currentUsers={allPapers?.data?.length ?? 0}
              currentPage={currentPage}
              limit={meta?.limit ?? 12}
              total={meta?.total ?? 0}
              onPageChange={(p: number) => setCurrentPage(p)}
              isLoading={isLoading}
            />
          </Card>
        )}
      </div>

      <PaperViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setTimeout(() => setSelectedPaperView(null), 300);
        }}
        paperUrl={selectedPaperView?.paperFile || undefined}
        paperName={selectedPaperView?.boardName || ""}
      />
    </div>
  );
}
