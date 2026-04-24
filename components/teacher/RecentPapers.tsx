"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "../ui/skeleton";
import { GeneratePaperSkeleton } from "../skeletons/GeneratePaperSkeleton";

import PaperRow from "./generated-papers/PaperRow";
import PaperPreviewDialog from "./generated-papers/PaperPreviewDialog";
import { useDeletePaperMutation } from "@/lib/api/paperGeneration";
import { useGetTeacherDashboardQuery } from "@/lib/api/dashboardApi";

import type { TeacherRecentPaper } from "@/types/teacher-dashboard";
import type { GeneratedPaper } from "@/types/generated-paper";

interface RecentPapersProps {
  isLoading: boolean;
  papers?: TeacherRecentPaper[];
}

export default function RecentPapers(props: RecentPapersProps) {
  const { isLoading, papers } = props;
  const router = useRouter();
  const { refetch } = useGetTeacherDashboardQuery();
  const [deletePaper, { isLoading: isDeleting }] = useDeletePaperMutation();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<GeneratedPaper | null>(null);

  // Normalize TeacherRecentPaper to GeneratedPaper format
  const normalizePaper = (paper: TeacherRecentPaper): GeneratedPaper => {
    return {
      id: paper.id,
      title: paper.title,
      totalMarks: paper.totalMarks,
      examTime: paper.examTime,
      createdAt: paper.createdAt,
      updatedAt: paper.createdAt, // Fallback
      subjectId: paper.subject.id,
      boardId: paper.board.id,
      classId: paper.subject.class.id,
      subject: {
        id: paper.subject.id,
        name: paper.subject.name,
        slug: paper.subject.slug,
      },
      board: {
        id: paper.board.id,
        name: paper.board.name,
        slug: paper.board.slug,
      },
      class: {
        id: paper.subject.class.id,
        name: paper.subject.class.name,
        slug: paper.subject.class.slug,
      },
      mcqs: new Array(paper.mcqs?.length || 0).fill({}),
      shortQs: new Array(paper.shortQs?.length || 0).fill({}),
      longQs: new Array(paper.longQs?.length || 0).fill({}),
    };
  };

  const handleView = (paper: GeneratedPaper) => {
    setPreviewPaper(paper);
    setPreviewOpen(true);
  };

  const handleRecreate = (paper: GeneratedPaper) => {
    localStorage.removeItem("selectedTopics");
    localStorage.removeItem("selectedChapters");
    localStorage.removeItem("selectedSubTopicsByChapter");
    router.push(
      `/teacher/paper-builder?boardId=${paper.boardId}&classId=${paper.classId}&subjectId=${paper.subjectId}&step=3`
    );
  };

  const handleDelete = async (paper: GeneratedPaper) => {
    try {
      await deletePaper({ id: paper.id, data: {} }).unwrap();
      toast({
        title: "Paper deleted",
        description: "The paper has been removed successfully.",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting paper:", err);
      toast({
        title: "Delete failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="space-y-4 animate-slide-in-up"
      style={{ animationDelay: "400ms" }}
    >
      <Toaster />
      
      {isLoading ? (
        <Skeleton className="w-64 h-8" />
      ) : (
        <h2 className="text-2xl font-bold text-foreground">
          Last Generated Papers
        </h2>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            <GeneratePaperSkeleton />
            <GeneratePaperSkeleton />
          </div>
        ) : papers && papers.length > 0 ? (
          papers.map((paper, index: number) => {
            const normalized = normalizePaper(paper);
            return (
              <div
                key={paper.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PaperRow
                  paper={normalized}
                  onView={handleView}
                  onRecreate={handleRecreate}
                  onDelete={handleDelete}
                  deleteDisabled={isDeleting}
                />
              </div>
            );
          })
        ) : (
          <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
            No papers generated yet. Create your first paper to see activity here.
          </div>
        )}
      </div>

      <PaperPreviewDialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setPreviewPaper(null);
        }}
        paper={previewPaper}
      />
    </div>
  );
}
