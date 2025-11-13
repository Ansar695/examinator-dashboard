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

const Papers = () => {
  const [filters, setFilters] = useState({
    search: "",
    subjectIds: [""],
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, refetch, isLoading, error } = useGetGeneratedPapersQuery({
    ...filters,
    page: currentPage,
  });

  const { data: subjects = [], isLoading: subjectsLoading } =
    useGetSubjectsQuery();

  const papers = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
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

  const LoadingSkeleton = () => (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background p-6">
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
        {isLoading ? (
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
                  <PaperGridView key={paper.id} paper={paper} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {papers.map((paper: any) => (
                  <PaperListViewItem key={paper.id} paper={paper} />
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
    </div>
  );
};

export default Papers;
