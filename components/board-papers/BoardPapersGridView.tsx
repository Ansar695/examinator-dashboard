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

interface BoardPapersGridViewProps {
  boardPapers: BoardPaper[];
  isAdmin: boolean;
  handleEditBoardPaper?: (paper: BoardPaper) => void;
  onDeleteBoardPaper?: (id: string) => void;
}

export default function BoardPapersGridView({
  boardPapers,
  onDeleteBoardPaper,
  handleEditBoardPaper,
  isAdmin,
}: BoardPapersGridViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<BoardPaper | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewPaper = (paper: BoardPaper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
  };

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
        {boardPapers?.map((board) => {
          const fileName =
            board.paperFile?.split("/")?.[
              board.paperFile?.split("/").length - 1
            ] || "Untitled board";

          const colorScheme = classColors[board?.boardYear] || classColors["1"];
          const isHovered = hoveredId === board.id;

          return (
            <div
              key={board.id}
              onMouseEnter={() => setHoveredId(board.id)}
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
                    <div className="mb-5">
                      <h4 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {board?.boardName}
                      </h4>
                      <p className="text-sm text-[var(--sidebar-foreground)] truncate">
                        Annual Board Paper{" "}
                        <span className="font-bold">{board?.boardYear}</span>
                      </p>
                    </div>
                  </div>

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
                          {BytesToMegaBytes(board?.fileSize)} MB
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
                          {formatDate(new Date(board?.updatedAt)).split(",")[0]}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-auto border-t border-border/50">
                    <Link href={board?.paperFile} download className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer w-full flex-1 h-10 font-semibold group/btn hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPaper(board);
                        }}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a href={board?.paperFile} download>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBoardPaper && handleEditBoardPaper(board);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all duration-200"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBoardPaper && onDeleteBoardPaper(board.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

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

      {/* <PaperViewerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paperUrl={selectedPaper?.paperFile || ""}
        paperName={selectedPaper?.boardName || ""}
      /> */}
    </>
  );
}
