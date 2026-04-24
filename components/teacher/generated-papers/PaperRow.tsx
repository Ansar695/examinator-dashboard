"use client";

import { Calendar, Clock, Eye, RotateCcw, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GeneratedPaper } from "@/types/generated-paper";
import { formatDate } from "@/utils/transformers/formatDate";
import DeletePaperDialogButton from "./DeletePaperDialogButton";

type PaperRowProps = {
  paper: GeneratedPaper;
  onView: (paper: GeneratedPaper) => void;
  onRecreate: (paper: GeneratedPaper) => void;
  onDelete: (paper: GeneratedPaper) => Promise<void> | void;
  deleteDisabled?: boolean;
};

export default function PaperRow({ paper, onView, onRecreate, onDelete, deleteDisabled }: PaperRowProps) {
  const mcqs = paper.mcqs?.length ?? 0;
  const shorts = paper.shortQs?.length ?? 0;
  const longs = paper.longQs?.length ?? 0;
  const totalQuestions = mcqs + shorts + longs;

  return (
    <Card className="border hover:shadow-md transition-shadow bg-card">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="capitalize">
                {paper.board?.name}
              </Badge>
              <Badge variant="secondary">Class {paper.class?.name}</Badge>
              <Badge variant="outline" className="capitalize">
                {paper.subject?.name}
              </Badge>
              <Badge variant="outline">{totalQuestions} Qs</Badge>
            </div>

            <button type="button" onClick={() => onView(paper)} className="mt-2 text-left w-full">
              <h3 className="text-base md:text-lg font-semibold text-foreground truncate capitalize hover:text-primary transition-colors">
                {paper.title}
              </h3>
            </button>

            <div className="mt-3 grid grid-cols-2 md:flex md:items-center gap-2 md:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{formatDate(new Date(paper.createdAt))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{paper.examTime ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="font-medium">{paper.totalMarks} marks</span>
              </div>
              <div className="text-muted-foreground md:ml-auto">
                MCQ {mcqs} · Short {shorts} · Long {longs}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="h-9 gap-2" onClick={() => onView(paper)}>
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button size="sm" variant="secondary" className="h-9 gap-2" onClick={() => onRecreate(paper)}>
              <RotateCcw className="h-4 w-4" />
              Create Another Paper
            </Button>
            <DeletePaperDialogButton
              onConfirm={() => onDelete(paper)}
              disabled={deleteDisabled}
              size="sm"
              variant="outline"
              buttonLabel="Delete"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
