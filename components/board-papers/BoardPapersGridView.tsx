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
  Sparkles,
} from "lucide-react";
import { BytesToMegaBytes } from "@/utils/transformers/bytesToMegaBytes";
import { BoardPaper } from "@/lib/api/boardPapersApi";
import { classColors } from "@/utils/static/classBadgeColors";
import Link from "next/link";
import BoardPaperCard from "./BoardPaperCard";

interface BoardPapersGridViewProps {
  boardPapers: BoardPaper[];
  isAdmin: boolean;
  onViewPaper?: (paper: BoardPaper) => void;
  handleEditBoardPaper?: (paper: BoardPaper) => void;
  onDeleteBoardPaper?: (id: string) => void;
}

export default function BoardPapersGridView({
  boardPapers,
  onViewPaper,
  onDeleteBoardPaper,
  handleEditBoardPaper,
  isAdmin,
}: BoardPapersGridViewProps) {

  if (boardPapers?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 border border-primary/20">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          No Board Papers Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Start by uploading your first board paper to get organized and access
          them anytime
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boardPapers?.map((board) => (
          <BoardPaperCard
            key={board.id}
            board={board}
            isAdmin={isAdmin}
            onView={(paper) => onViewPaper?.(paper)}
            onEdit={handleEditBoardPaper}
            onDelete={onDeleteBoardPaper}
          />
        ))}
      </div>

      {/* <PaperViewerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paperUrl={selectedPaper?.paperFile || ""}
        paperName={selectedPaper?.boardName || ""}
      /> */}
    </>
  );
}
