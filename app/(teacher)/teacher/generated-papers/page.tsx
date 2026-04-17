"use client";
import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useGetGeneratedPapersQuery } from "@/lib/api/generatedPapers";
import { useGetSubjectsQuery } from "@/lib/api/educationApi";
import CustomPagination from "@/components/common/Pagination";
import { useDeletePaperMutation } from "@/lib/api/paperGeneration";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import GeneratedPapersHeader from "@/components/teacher/generated-papers/GeneratedPapersHeader";
import PapersToolbar from "@/components/teacher/generated-papers/PapersToolbar";
import PapersSummary from "@/components/teacher/generated-papers/PapersSummary";
import PapersLoadingGrid from "@/components/teacher/generated-papers/PapersLoadingGrid";
import PapersErrorState from "@/components/teacher/generated-papers/PapersErrorState";
import PapersEmptyState from "@/components/teacher/generated-papers/PapersEmptyState";
import PaperCard from "@/components/teacher/generated-papers/PaperCard";
import PaperRow from "@/components/teacher/generated-papers/PaperRow";
import PaperPreviewDialog from "@/components/teacher/generated-papers/PaperPreviewDialog";
import type { GeneratedPapersSortBy, GeneratedPapersSortOrder } from "@/types/generated-paper";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRouter } from "next/navigation";
import type { GeneratedPaper } from "@/types/generated-paper";

const Papers = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [subjectId, setSubjectId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<GeneratedPapersSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<GeneratedPapersSortOrder>("desc");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<GeneratedPaper | null>(null);

  const debouncedSearch = useDebouncedValue(search, 350);

  const queryArgs = useMemo(
    () => ({
      search: debouncedSearch,
      subjectIds: subjectId === "all" ? [] : [subjectId],
      page: currentPage,
      sortBy,
      sortOrder,
      limit: 12,
    }),
    [debouncedSearch, subjectId, currentPage, sortBy, sortOrder]
  );

  const { data, refetch, isLoading, error } = useGetGeneratedPapersQuery(queryArgs);

  const { data: subjects = [], isLoading: subjectsLoading } =
    useGetSubjectsQuery();

  const [deletePaper, { isLoading: isDeleting }] = useDeletePaperMutation();

  const loading = isLoading || isDeleting;

  const papers = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 12,
  };

  const subjectName = useMemo(() => {
    if (subjectId === "all") return undefined;
    const found = (subjects as any[])?.find((s) => s?.id === subjectId);
    return found?.name as string | undefined;
  }, [subjects, subjectId]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSubjectChange = (value: string) => {
    setSubjectId(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: `${GeneratedPapersSortBy}:${GeneratedPapersSortOrder}`) => {
    const [nextBy, nextOrder] = value.split(":") as [GeneratedPapersSortBy, GeneratedPapersSortOrder];
    setSortBy(nextBy);
    setSortOrder(nextOrder);
    setCurrentPage(1);
  };

  const handleView = (paper: GeneratedPaper) => {
    setPreviewPaper(paper);
    setPreviewOpen(true);
  };

  const handleRecreate = (paper: GeneratedPaper) => {
    router.push(
      `/${paper.board.slug}/${paper.class.name}/${paper.subject.slug}/select-questions?subjectId=${paper.subjectId}&paperId=${paper.id}`
    );
  };

  const handleDelete = async (paper: GeneratedPaper) => {
    try {
      await deletePaper({ id: paper.id, data: {} }).unwrap();
      toast({ title: "Paper deleted", description: "The paper has been removed successfully." });
      refetch();
    } catch (err) {
      console.error("Error deleting paper:", err);
      toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,hsl(var(--primary))/0.12,transparent_55%),radial-gradient(900px_circle_at_100%_40%,hsl(38_92%_50%)/0.10,transparent_45%)] p-4 sm:p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto space-y-5">
        <GeneratedPapersHeader />

        <PapersToolbar
          search={search}
          onSearchChange={handleSearchChange}
          subjectId={subjectId}
          onSubjectChange={handleSubjectChange}
          subjects={(subjects as any[])?.map((s) => ({ id: s.id, name: s.name })) ?? []}
          subjectsLoading={subjectsLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <PapersSummary
          total={meta.total}
          search={search}
          subjectName={subjectName}
          onClearFilters={() => {
            setSearch("");
            setSubjectId("all");
            setCurrentPage(1);
          }}
        />

        {/* Papers Display */}
        {loading ? <PapersLoadingGrid viewMode={viewMode} /> : null}

        {!loading && error ? <PapersErrorState onRetry={() => refetch()} /> : null}

        {!loading && !error && papers.length === 0 ? (
          <PapersEmptyState
            title={search.trim() || subjectId !== "all" ? "No papers found" : "No papers yet"}
            description={
              search.trim() || subjectId !== "all"
                ? "Try changing your search, subject filter, or sort order."
                : "Create your first paper and build a reusable paper bank for your institution."
            }
          />
        ) : null}

        {!loading && !error && papers.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {papers.map((paper: any) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  onView={handleView}
                  onRecreate={handleRecreate}
                  onDelete={handleDelete}
                  deleteDisabled={isDeleting}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {papers.map((paper: any) => (
                <PaperRow
                  key={paper.id}
                  paper={paper}
                  onView={handleView}
                  onRecreate={handleRecreate}
                  onDelete={handleDelete}
                  deleteDisabled={isDeleting}
                />
              ))}
            </div>
          )
        ) : null}

        {/* Pagination */}
        {!loading && !error && meta.totalPages > 1 ? (
          <Card>
            <CustomPagination
              currentPage={currentPage}
              currentUsers={papers.length}
              total={meta.total}
              totalPages={meta.totalPages}
              limit={meta.pageSize}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
              itemName="papers"
            />
          </Card>
        ) : null}
      </div>

      <PaperPreviewDialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setPreviewPaper(null);
        }}
        paper={previewPaper}
      />
    </div>
  );
};

export default Papers;
