"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNotesModal from "@/components/notes/AddNotesModal";
import NotesList from "@/components/notes/NotesList";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  type Note,
  useDeleteNoteMutation,
  useGetNotesQuery,
  useGetClassesQuery,
} from "@/lib/api/notesApi";
import CustomSpinner from "@/components/shared/CustomSpinner";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { NotesFilter } from "@/components/notes/NotesFilters";
import CustomPagination from "@/components/common/Pagination";

export default function NotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filters, setFilters] = useState({ search: "", classId: "", userType: '' });
  const[currentPage, setCurrentPage] = useState<number>(1)
  console.log("filters ==>>> ", filters)
  const {
    data: allNotes,
    refetch: refetchNotes,
    isLoading,
  } = useGetNotesQuery(filters ?? undefined);

  const { data: classesData } = useGetClassesQuery();

  const [deleteNote, { isLoading: isDeleting, error: deleteError }] =
    useDeleteNoteMutation();

  const loading = isDeleting || isLoading;

  const handleDeleteNote = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;
    try {
      await deleteNote(id).unwrap();
      toast({
        title: "Success",
        description: "Note deleted successfully.",
      });
      refetchNotes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditing(note);
    setIsModalOpen(true);
  };

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
  }

  return (
    <DashboardLayout>
      <Toaster />
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
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
                  {allNotes?.meta?.total === 1 ? "note" : "notes"} available
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditing(null);
                  setIsModalOpen(true);
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            <NotesFilter
              classes={classesData as any ?? []}
              onFilterChange={handleFilterChange}
              isLoading={loading}
            />
          </div>

          {/* Notes List */}
          {loading ? (
            <CustomSpinner />
          ) : (
            <NotesList
              notes={allNotes?.data ?? []}
              onDeleteNote={handleDeleteNote}
              handleEditNote={handleEditNote}
            />
          )}
          {/* Pagination */}
          {meta?.totalPages > 1 && <CustomPagination
            totalPages={meta?.totalPages ?? 1}
            currentUsers={allNotes?.data?.length ?? 0}
            currentPage={currentPage}
            limit={meta?.limit ?? 20}
            total={meta?.total ?? 0}
            onPageChange={(p: number) => setCurrentPage(p)}
            isLoading={isLoading}
          />}
        </div>
      </main>

      <AddNotesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        refetchNotes={refetchNotes}
        editingNote={editing}
      />
    </DashboardLayout>
  );
}
