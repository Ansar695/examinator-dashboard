"use client";

import { FileText } from "lucide-react";
import { Note } from "@/lib/api/notesApi";
import ImportantNoteCard from "./ImportantNoteCard";

interface NotesGridViewProps {
  notes: Note[];
  isAdmin: boolean;
  onViewNote?: (note: Note) => void;
  handleEditNote?: (note: Note) => void;
  onDeleteNote?: (id: string) => void;
}

export default function NotesGridView({
  notes,
  onViewNote,
  onDeleteNote,
  handleEditNote,
  isAdmin,
}: NotesGridViewProps) {
  if (notes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          No Notes Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Start by uploading your first note to get organized and access them anytime
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes?.map((note) => (
        <ImportantNoteCard
          key={note.id}
          note={note}
          isAdmin={isAdmin}
          onView={(n) => onViewNote?.(n)}
          onEdit={handleEditNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}