"use client";

import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratePaperSkeleton } from "../skeletons/GeneratePaperSkeleton";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import type { TeacherRecentPaper } from "@/types/teacher-dashboard";


interface RecentPapersProps {
  isLoading: boolean;
  papers?: TeacherRecentPaper[];
}

export default function RecentPapers(props: RecentPapersProps) {
  const { isLoading, papers } = props;
  const router = useRouter();
  
  const handleGenerateAgain = (paper: TeacherRecentPaper) => {
    router.push(
      `/${paper.board.slug}/${paper.subject.class.name}/${paper.subject.slug}/select-topics?subjectId=${paper.subject.id}`
    );
  };

  return (
    <div
      className="space-y-4 animate-slide-in-up"
      style={{ animationDelay: "400ms" }}
    >
      {isLoading ? (
        <Skeleton className="w-64 h-6 " />
      ) : (
        <h2 className="text-2xl font-bold text-foreground">
          Last Generated Papers
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <GeneratePaperSkeleton />
        ) : (
          papers && papers.length > 0 ? papers.map((paper, index: number) => (
            <div
              key={paper.id}
              className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors capitalize">
                    {paper?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(paper?.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-medium border">
                  {paper?.totalMarks} Marks
                </span>
              </div>

              {/* Details */}
              <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {paper?.longQs?.length +
                      paper?.shortQs?.length +
                      paper?.mcqs?.length}
                  </span>
                  <span>Questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{paper?.examTime}</span>
                  <span>Duration</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs gap-1.5 bg-transparent hover:bg-primary/10"
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">View</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs gap-1.5 bg-transparent hover:bg-primary/10"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleGenerateAgain(paper)}
                  className="flex-1 h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70"
                >
                  <span className="hidden sm:inline">
                    Create Paper
                  </span>
                </Button>
              </div>
            </div>
          )) : (
            <div className="col-span-full border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
              No papers generated yet. Create your first paper to see activity here.
            </div>
          )
        )}
      </div>
    </div>
  );
}
