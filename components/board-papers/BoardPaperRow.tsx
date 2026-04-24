"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Edit2, Eye, Calendar, HardDrive } from "lucide-react";
import { BytesToMegaBytes } from "@/utils/transformers/bytesToMegaBytes";
import { BoardPaper } from "@/lib/api/boardPapersApi";
import { classColors } from "@/utils/static/classBadgeColors";

interface BoardPaperRowProps {
  board: BoardPaper;
  isAdmin: boolean;
  onView: (paper: BoardPaper) => void;
  onEdit?: (paper: BoardPaper) => void;
  onDelete?: (id: string) => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const BoardPaperRow = memo(
  ({ board, isAdmin, onView, onEdit, onDelete }: BoardPaperRowProps) => {
    return (
      <div className="group relative bg-card hover:bg-accent/5 transition-colors duration-200 border border-border/60 hover:border-primary/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-primary/20 shadow-sm transition-transform group-hover:scale-105">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <h4 className="font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">
                {board?.boardName}
              </h4>
              <span
                className={`inline-flex flex-shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide ${
                  classColors[board?.boardYear] || classColors["1"]
                }`}
              >
                Class {board?.boardYear}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center font-medium">
                <HardDrive className="w-3.5 h-3.5 mr-1.5 text-blue-500/70" />
                {BytesToMegaBytes(board?.fileSize)} MB
              </span>
              <span className="flex items-center font-medium">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-500/70" />
                {formatDate(new Date(board?.updatedAt))}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border/50 sm:border-0">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors h-9"
            onClick={() => onView(board)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => onView(board)}
          >
             <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Download board"
            asChild
          >
            <a href={board?.paperFile} download>
              <Download className="w-4 h-4" />
            </a>
          </Button>

          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit && onEdit(board)}
                className="w-9 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                title="Edit board"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete && onDelete(board.id)}
                className="w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Delete board"
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

BoardPaperRow.displayName = "BoardPaperRow";

export default BoardPaperRow;
