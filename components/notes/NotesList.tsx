import React from "react";
import { FileText } from "lucide-react";
import { Note } from "@/lib/api/notesApi";
import ImportantNoteRow from "./ImportantNoteRow";

interface NotesListProps {
  notes: Note[];
  isAdmin: boolean;
  onViewNote?: (note: Note) => void;
  handleEditNote?: (note: Note) => void;
  onDeleteNote?: (id: string) => void;
}

export default function NotesList({
  notes,
  onViewNote,
  onDeleteNote,
  handleEditNote,
  isAdmin,
}: NotesListProps) {
  if (notes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">No notes yet</h3>
        <p className="text-sm text-muted-foreground">
          Start by uploading your first note to get organized
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {notes.map((note) => (
        <ImportantNoteRow
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
