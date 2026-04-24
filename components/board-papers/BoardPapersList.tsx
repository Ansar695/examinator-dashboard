import React from "react";
import BoardPaperRow from "./BoardPaperRow";
import { BoardPaper } from "@/lib/api/boardPapersApi";
import { FileText } from "lucide-react";

interface BoardPapersListProps {
  boardPapers: BoardPaper[];
  isAdmin: boolean;
  onViewPaper?: (paper: BoardPaper) => void;
  handleEditBoardPaper?: (paper: BoardPaper) => void;
  onDeleteBoardPaper?: (id: string) => void;
}

export default function BoardPapersList({
  boardPapers,
  onViewPaper,
  onDeleteBoardPaper,
  handleEditBoardPaper,
  isAdmin,
}: BoardPapersListProps) {
  if (boardPapers?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">
          No Board paper found
        </h3>
        <p className="text-sm text-muted-foreground">
          Start by uploading your first board paper to get organized
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {boardPapers?.map((board) => (
        <BoardPaperRow
          key={board.id}
          board={board}
          isAdmin={isAdmin}
          onView={(paper) => onViewPaper?.(paper)}
          onEdit={handleEditBoardPaper}
          onDelete={onDeleteBoardPaper}
        />
      ))}
    </div>
  );
}
