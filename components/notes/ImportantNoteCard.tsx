"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Edit2, Eye, Calendar, HardDrive } from "lucide-react";
import { BytesToMegaBytes } from "@/utils/transformers/bytesToMegaBytes";
import { Note } from "@/lib/api/notesApi";
import { classColors } from "@/utils/static/classBadgeColors";

interface ImportantNoteCardProps {
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

const ImportantNoteCard = memo(
  ({ note, isAdmin, onView, onEdit, onDelete }: ImportantNoteCardProps) => {
    return (
      <div className="group relative h-full rounded-2xl overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl backdrop-blur-xl group-hover:border-primary/30 transition-colors" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 p-5 md:p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 ring-1 ring-primary/20 shadow-sm transition-all group-hover:scale-105 group-hover:ring-primary/40 group-hover:shadow-primary/20">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-foreground mb-1.5 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {note?.notesTitle}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                      classColors[note?.class?.name] || classColors["1"]
                    }`}
                  >
                    Class {note?.class?.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Note
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 rounded-xl bg-background/50 border border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Size
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {BytesToMegaBytes(note?.fileSize)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Updated
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(new Date(note?.updatedAt)).split(",")[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-4 mt-auto border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer w-full flex-1 h-10 font-semibold group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(note);
                }}
              >
                <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                View Note
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer h-10 w-10 shrink-0 hover:bg-primary hover:border-primary/50 hover:text-white transition-all duration-200"
                title="Download"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={note?.file} download>
                  <Download className="w-4 h-4" />
                </a>
              </Button>
              {isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(note);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all duration-200"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(note.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]" />
        </div>
      </div>
    );
  }
);

ImportantNoteCard.displayName = "ImportantNoteCard";

export default ImportantNoteCard;
