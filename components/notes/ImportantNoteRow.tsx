"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Edit2, Eye, Calendar, HardDrive } from "lucide-react";
import { BytesToMegaBytes } from "@/utils/transformers/bytesToMegaBytes";
import { Note } from "@/lib/api/notesApi";
import { classColors } from "@/utils/static/classBadgeColors";

interface ImportantNoteRowProps {
  note: Note;
  isAdmin: boolean;
  onView: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (id: string) => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ImportantNoteRow = memo(
  ({ note, isAdmin, onView, onEdit, onDelete }: ImportantNoteRowProps) => {
    return (
      <div className="group relative bg-card hover:bg-accent/5 transition-colors duration-200 border border-border/60 hover:border-primary/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-primary/20 shadow-sm transition-transform group-hover:scale-105">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h4 className="font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">
                {note?.notesTitle}
              </h4>
              <span
                className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide ${
                  classColors[note?.class?.name] || classColors["1"]
                }`}
              >
                Class {note?.class?.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center font-medium">
                <HardDrive className="w-3.5 h-3.5 mr-1.5 text-blue-500/70" />
                {BytesToMegaBytes(note?.fileSize)} MB
              </span>
              <span className="flex items-center font-medium">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-500/70" />
                {formatDate(new Date(note?.updatedAt))}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border/50 sm:border-0">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors h-9"
            onClick={() => onView(note)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => onView(note)}
          >
             <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Download note"
            asChild
          >
            <a href={note?.file} download>
              <Download className="w-4 h-4" />
            </a>
          </Button>

          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit && onEdit(note)}
                className="w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                title="Edit note"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete && onDelete(note.id)}
                className="w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
);

ImportantNoteRow.displayName = "ImportantNoteRow";

export default ImportantNoteRow;
