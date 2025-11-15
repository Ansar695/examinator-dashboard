"use client";

import { useState } from "react";
import NotesList from "@/components/notes/NotesList";
import {
  useGetNotesQuery,
  useGetClassesQuery,
  useGetTeacherNotesQuery,
} from "@/lib/api/notesApi";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { NotesFilter } from "@/components/notes/NotesFilters";
import CustomPagination from "@/components/common/Pagination";
import { BoardPapersListSkeleton } from "@/components/skeletons/BoardPapersSkeleton";

export default function ImportantNotes() {
  const [filters, setFilters] = useState({
    search: "",
    classId: "",
    userType: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: allNotes,
    refetch: refetchNotes,
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
  };

  const meta = allNotes?.meta || {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  };

   if (error) {
      toast({
        title: "Error",
        description:
          "Error occured while fetching papers. Please check your internet connection.",
        variant: "destructive",
      });
      return (
        <div className="w-full flex items-center justify-center p-6">
          <p className="text-muted-foreground">
            No paper found.
          </p>
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
                Notes Library
              </h1>
              <p className="text-muted-foreground">
                {allNotes?.meta?.total ?? 0}{" "}
                {allNotes?.meta?.total === 1 ? "Note" : "Notes"} available
              </p>
            </div>
          </div>

          <NotesFilter
            classes={(classesData as any) ?? []}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            isAdmin={false}
          />
        </div>

        {/* Notes List */}
        {isLoading ? (
          <BoardPapersListSkeleton />
        ) : (
          <NotesList
            notes={allNotes?.data ?? []}
            isAdmin={false}
          />
        )}
        {/* Pagination */}
        {meta?.totalPages > 1 && (
          <CustomPagination
            totalPages={meta?.totalPages ?? 1}
            currentUsers={allNotes?.data?.length ?? 0}
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
