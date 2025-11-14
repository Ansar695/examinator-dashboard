"use client";
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGeneratedPapersQuery } from "@/lib/api/generatedPapers";
import { useGetSubjectsQuery } from "@/lib/api/educationApi";
import CustomPagination from "@/components/common/Pagination";
import GeneratedPapersFilters from "@/components/teacher/GeneratedPapersFilters";
import { PaperListViewItem } from "@/components/teacher/PaperListView";
import { PaperGridView } from "@/components/teacher/PaperGridView";
import { PaperPreviewModal } from "@/components/questions/PaperPreviewModal";
import { useDeletePaperMutation } from "@/lib/api/paperGeneration";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { PaperGridSkeleton } from "@/components/skeletons/PaperGridSkeleton";

const Papers = () => {
  const [filters, setFilters] = useState({
    search: "",
    subjectIds: [""],
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentPaperData, setCurrentPaperData] = useState<any>(null);

  const { data, refetch, isLoading, error } = useGetGeneratedPapersQuery({
    ...filters,
    page: currentPage,
  });

  const { data: subjects = [], isLoading: subjectsLoading } =
    useGetSubjectsQuery();

  const [deletePaper, { isLoading: isDeleting, error: deletingError }] =
    useDeletePaperMutation();

  const loading = isLoading || isDeleting;

  const papers = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  };

  const handleViewPaper = (paper: any) => {
    setCurrentPaperData(paper);
    setShowPreviewModal(true);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleSubjectFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      subjectIds: value === "all" ? [""] : [value],
    }));
    setCurrentPage(1);
  };

  const handlePaperDelete = async (paperId: string) => {
    if (confirm("Are you sure you want to delete this paper?")) {
      try {
        await deletePaper({ id: paperId, data: {} }).unwrap();
        toast({
          title: "Paper Deleted",
          description: "Paper deleted successfully",
        });
        refetch();
      } catch (error) {
        console.error("Error deleting paper:", error);
      }
    }
  };

  const LoadingSkeleton = () => (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {[...Array(6)].map((_, i) => (
        <PaperGridSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Generated Papers
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and view all your generated exam papers
          </p>
        </div>

        {/* Filters and Search */}
        <GeneratedPapersFilters
          filters={filters}
          handleSearch={handleSearch}
          handleSubjectFilter={handleSubjectFilter}
          subjectsLoading={subjectsLoading}
          subjects={subjects}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Papers Display */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Card className="p-12 text-center border-2 border-destructive/20">
            <div className="text-destructive mb-2 text-lg font-semibold">
              Error loading papers
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </Card>
        ) : papers.length === 0 ? (
          <Card className="p-12 text-center border-2 border-dashed">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No papers found</h3>
            <p className="text-muted-foreground">
              {filters.search || filters.subjectIds[0]
                ? "Try adjusting your filters"
                : "Start by generating your first paper"}
            </p>
          </Card>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper: any) => (
                  <PaperGridView
                    key={paper.id}
                    paper={paper}
                    handleViewPaper={handleViewPaper}
                    handlePaperDelete={handlePaperDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper: any) => (
                  <PaperListViewItem
                    key={paper.id}
                    paper={paper}
                    handleViewPaper={handleViewPaper}
                    handlePaperDelete={handlePaperDelete}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <Card>
                <CustomPagination
                  currentPage={currentPage}
                  currentUsers={papers.length}
                  total={meta.total}
                  totalPages={meta.totalPages}
                  limit={meta.limit}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </Card>
            )}
          </>
        )}
      </div>
      <PaperPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        paperData={
          currentPaperData ? { ...currentPaperData, examTime: "2:30" } : null
        }
        board={"Punjab"}
        classNumber="12"
        subject="Chemistry"
      />
    </div>
  );
};

export default Papers;
