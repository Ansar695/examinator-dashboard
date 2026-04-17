"use client";

import { useState } from "react";
import NotesList from "@/components/notes/NotesList";
import NotesGridView from "@/components/notes/NotesGridView";
import {
  useGetClassesQuery,
  useGetTeacherNotesQuery,
} from "@/lib/api/notesApi";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { NotesFilter } from "@/components/notes/NotesFilters";
import CustomPagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { BoardPapersListSkeleton } from "@/components/skeletons/BoardPapersSkeleton";
import { BoardPaperGridSkeleton } from "@/components/skeletons/BoardPaperGridSkeleton";
import PaperViewerModal from "@/components/board-papers/PaperViewerModal";
import { FileText } from "lucide-react";
import { Note } from "@/lib/api/notesApi";

export default function ImportantNotes() {
  const [filters, setFilters] = useState({
    search: "",
    classId: "all",
    userType: "all",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [selectedNoteView, setSelectedNoteView] = useState<Note | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {
    data: allNotes,
    isLoading,
    error
  } = useGetTeacherNotesQuery(filters ?? undefined);

  const { data: classesData } = useGetClassesQuery();

  const handleFilterChange = (newFilters: {
    search: string;
    classId: string;
    userType: string;
  }) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNoteView(note);
    setIsViewerOpen(true);
  };

  const meta = allNotes?.meta || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  if (error && !isLoading) {
    toast({
      title: "Error",
      description:
        "An error occurred while fetching notes. Please check your internet connection.",
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
              Important Notes Library
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Explore, download, and review essential class notes.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-background/50 px-5 py-3 rounded-xl border border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {isLoading ? "..." : meta?.total ?? 0}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Total Notes
              </p>
            </div>
          </div>
        </div>

        <NotesFilter
          classes={(classesData as any)?.data ?? []}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
          isAdmin={false}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Notes Display area */}
        {isLoading ? (
          viewMode === "list" ? (
             <BoardPapersListSkeleton />
          ) : (
             <BoardPaperGridSkeleton />
          )
        ) : error && !isLoading ? (
          <div className="flex items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground font-medium">Failed to load notes.</p>
          </div>
        ) : (
          viewMode === "list" ? (
            <NotesList
              notes={allNotes?.data ?? []}
              isAdmin={false}
              onViewNote={handleViewNote}
            />
          ) : (
            <NotesGridView
              notes={allNotes?.data ?? []}
              isAdmin={false}
              onViewNote={handleViewNote}
            />
          )
        )}

        {/* Pagination */}
        {meta?.totalPages > 1 && !isLoading && (
          <Card className="mt-6 border-none shadow-sm bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <CustomPagination
              totalPages={meta?.totalPages ?? 1}
              currentUsers={allNotes?.data?.length ?? 0}
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
          setTimeout(() => setSelectedNoteView(null), 300);
        }}
        paperUrl={selectedNoteView?.file || undefined}
        paperName={selectedNoteView?.notesTitle || "Note"}
      />
    </div>
  );
}
