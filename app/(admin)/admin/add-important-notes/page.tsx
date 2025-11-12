"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNotesModal from "@/components/notes/AddNotesModal";
import NotesList from "@/components/notes/NotesList";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useGetNotesQuery } from "@/lib/api/notesApi";

interface Note {
  id: string;
  title: string;
  class: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Chemistry Fundamentals",
      class: "10",
      fileName: "chemistry-notes.pdf",
      fileSize: 2.5,
      uploadedAt: new Date("2025-11-01"),
    },
    {
      id: "2",
      title: "Biology - Cell Structure",
      class: "11",
      fileName: "cell-structure.pdf",
      fileSize: 1.8,
      uploadedAt: new Date("2025-10-28"),
    },
    {
      id: "3",
      title: "Physics - Thermodynamics",
      class: "12",
      fileName: "thermodynamics.pdf",
      fileSize: 3.2,
      uploadedAt: new Date("2025-10-25"),
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const { data:allNotes, refetch: refetchNotes, isLoading } = useGetNotesQuery()
  console.log("Fetched Notes:", allNotes);
  const handleAddNote = (newNote: Omit<Note, "id" | "uploadedAt">) => {
    const note: Note = {
      ...newNote,
      id: Date.now().toString(),
      uploadedAt: new Date(),
    };
    setNotes([note, ...notes]);
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const filteredNotes =
    selectedClass === "all"
      ? notes
      : notes.filter((note) => note.class === selectedClass);

  return (
    <DashboardLayout>
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {selectedClass === "all"
                  ? "All Notes"
                  : `Class ${selectedClass} Notes`}
              </h1>
              <p className="text-muted-foreground">
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"}
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Notes List */}
          <NotesList notes={filteredNotes} onDeleteNote={handleDeleteNote} />
        </div>
      </main>

      <AddNotesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddNote={handleAddNote}
      />
    </DashboardLayout>
  );
}
