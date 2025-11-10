"use client";

import { useState } from "react";
import { RotateCcw, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratePaperSkeleton } from "../skeletons/GeneratePaperSkeleton";
import { Skeleton } from "../ui/skeleton";

interface RecentPaper {
  id: string;
  title: string;
  subject: string;
  date: string;
  questions: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const recentPapersData: RecentPaper[] = [
  {
    id: "1",
    title: "Mathematics - Algebra Basics",
    subject: "Mathematics",
    date: "2024-10-20",
    questions: 25,
    duration: "90 min",
    difficulty: "Medium",
  },
  {
    id: "2",
    title: "Physics - Mechanics & Motion",
    subject: "Physics",
    date: "2024-10-18",
    questions: 30,
    duration: "120 min",
    difficulty: "Hard",
  },
  {
    id: "3",
    title: "English - Literature Analysis",
    subject: "English",
    date: "2024-10-15",
    questions: 20,
    duration: "60 min",
    difficulty: "Easy",
  },
  {
    id: "4",
    title: "Chemistry - Organic Compounds",
    subject: "Chemistry",
    date: "2024-10-12",
    questions: 28,
    duration: "100 min",
    difficulty: "Hard",
  },
];

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-700 border-green-200",
  Medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  Hard: "bg-red-500/10 text-red-700 border-red-200",
};

interface RecentPapersProps {
  isLoading: boolean;
  papers: any;
}

export default function RecentPapers(props: RecentPapersProps) {
  const { isLoading, papers } = props;
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerateAgain = (paperId: string) => {
    setGeneratingId(paperId);
    // Simulate generation
    setTimeout(() => {
      setGeneratingId(null);
      // Show toast notification (you can add toast library)
      console.log(`Paper ${paperId} generated again`);
    }, 2000);
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
          papers?.map((paper: any, index: number) => (
            <div
              key={paper?._id}
              className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {paper.title}
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
                  onClick={() => handleGenerateAgain(paper.id)}
                  disabled={generatingId === paper.id}
                  className="flex-1 h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-70"
                >
                  <RotateCcw
                    size={14}
                    className={generatingId === paper.id ? "animate-spin" : ""}
                  />
                  <span className="hidden sm:inline">
                    {generatingId === paper.id
                      ? "Generating..."
                      : "Generate Again"}
                  </span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
