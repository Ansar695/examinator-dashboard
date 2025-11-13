"use client";

import { useEffect, useState } from "react";
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
import {
  BoardPaper,
  useDeleteBoardPaperMutation,
  useGetBoardPapersQuery,
  useGetSubBoardsQuery,
} from "@/lib/api/boardPapersApi";
import { BoardPaperFilters } from "@/components/board-papers/BoardPaperFilters";
import BoardPapersList from "@/components/board-papers/BoardPapersList";
import AddBoardPaperModal from "@/components/board-papers/AddBoardPaperModal";

export default function AddBoardsPapers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filters, setFilters] = useState({ search: "", boardName: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const[boardNames, setBoardNames] = useState([])

  const {
    data: allPapers,
    refetch: refetchBoardPapers,
    isLoading,
  } = useGetBoardPapersQuery(filters ?? undefined);

  const { data: allNames, isLoading: boardLoading } = useGetSubBoardsQuery();
  console.log("boardNames ", boardNames)
  const [deleteBoardPaper, { isLoading: isDeleting, error: deleteError }] =
    useDeleteBoardPaperMutation();

  const loading = isDeleting || isLoading;

  const handleDeleteNote = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this board paper?"
    );
    if (!confirmDelete) return;
    try {
      await deleteBoardPaper(id).unwrap();
      toast({
        title: "Success",
        description: "Board paper deleted successfully.",
      });
      refetchBoardPapers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the board paper. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditBoardPaper = (paper: BoardPaper) => {
    setEditing(paper);
    setIsModalOpen(true);
  };

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
    if(allNames?.data?.length){
      const transformed = allNames?.data?.map((da) => {
        return {
          name: da?.boardName,
          id: da?.boardName
        }
      })
      setBoardNames(transformed as any)
    }
  }, [allNames])

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
                  Board Papers Library
                </h1>
                <p className="text-muted-foreground">
                  {allPapers?.meta?.total ?? 0}{" "}
                  {allPapers?.meta?.total === 1 ? "Board Paper" : "Board Papers"} available
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

            <BoardPaperFilters
              boardNames={boardNames ?? []}
              onFilterChange={handleFilterChange}
              isLoading={loading}
            />
          </div>

          {/* Notes List */}
          {loading ? (
            <CustomSpinner />
          ) : (
            <BoardPapersList
              boardPapers={allPapers?.data ?? []}
              onDeleteBoardPaper={handleDeleteNote}
              handleEditBoardPaper={handleEditBoardPaper}
              isAdmin={true}
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
      </main>

      <AddBoardPaperModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        refetchBoardPapers={refetchBoardPapers}
        editingBoardPaper={editing}
      />
    </DashboardLayout>
  );
}
