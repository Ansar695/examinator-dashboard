// components/Notes/NotesGridView.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Trash2,
  Download,
  Edit2,
  Eye,
  Calendar,
  HardDrive,
  File,
} from "lucide-react";
import { BytesToMegaBytes } from "@/utils/transformers/bytesToMegaBytes";
import { Note } from "@/lib/api/notesApi";
import Link from "next/link";

interface NotesGridViewProps {
  notes: Note[];
  isAdmin: boolean;
  handleEditNote?: (note: Note) => void;
  onDeleteNote?: (id: string) => void;
}

const classColors: Record<string, string> = {
  "1": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  "2": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
  "3": "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
  "4": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  "5": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
  "6": "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-100",
  "7": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  "8": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  "9": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  "10": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  "11": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100",
  "12": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100",
};

export default function NotesGridView({
  notes,
  onDeleteNote,
  handleEditNote,
  isAdmin,
}: NotesGridViewProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (notes?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <File className="w-4 h-4 text-primary" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          No Notes Yet
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Start building your collection by uploading your first note. Keep all your study materials organized in one place.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes?.map((note) => {
        const fileName =
          note.file?.split("/")?.[note.file?.split("/").length - 1] ||
          "Untitled Note";
        const isHovered = hoveredId === note.id;

        return (
          <div
            key={note.id}
            onMouseEnter={() => setHoveredId(note.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative h-full rounded-xl overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl backdrop-blur-xl" />

            <div className="relative z-10 h-full flex flex-col">
              {/* Content section */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <div className="mb-5 flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {note?.notesTitle}
                    </h4>
                    <Badge
                      className={`${
                        classColors[note?.class?.name] || classColors["1"]
                      }`}
                    >
                      Class {note?.class?.name}
                    </Badge>
                  </div>
                </div>

                {/* File Name */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border/50">
                  <File className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{fileName}</span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <HardDrive className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        Size
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {BytesToMegaBytes(note?.fileSize)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-medium">
                        Updated
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {formatDate(new Date(note?.updatedAt)).split(",")[0]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 mt-auto border-t border-border/50">
                  <Link href={note?.file} download className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer w-full h-10 font-semibold group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer h-10 w-10 hover:bg-primary hover:border-primary/50 hover:text-white transition-all duration-200"
                    title="Download"
                    asChild
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
                        className="h-10 w-10 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-200"
                        title="Edit"
                        onClick={() => {
                          handleEditNote && handleEditNote(note);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all duration-200"
                        title="Delete"
                        onClick={() => {
                          onDeleteNote && onDeleteNote(note.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div
              className={`absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 rounded-2xl border border-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        );
      })}
    </div>
  )}