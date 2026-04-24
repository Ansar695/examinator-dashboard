"use client";

import { Calendar, Clock, Eye, RotateCcw, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PaperStatsPills from "./PaperStatsPills";
import type { GeneratedPaper } from "@/types/generated-paper";
import { formatDate } from "@/utils/transformers/formatDate";
import DeletePaperDialogButton from "./DeletePaperDialogButton";

type PaperCardProps = {
  paper: GeneratedPaper;
  onView: (paper: GeneratedPaper) => void;
  onRecreate: (paper: GeneratedPaper) => void;
  onDelete: (paper: GeneratedPaper) => Promise<void> | void;
  deleteDisabled?: boolean;
};

export default function PaperCard({ paper, onView, onRecreate, onDelete, deleteDisabled }: PaperCardProps) {
  const mcqs = paper.mcqs?.length ?? 0;
  const shorts = paper.shortQs?.length ?? 0;
  const longs = paper.longQs?.length ?? 0;

  return (
    <Card className="group relative overflow-hidden border hover:shadow-xl transition-shadow bg-card">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-primary/12 via-sky-500/10 to-transparent blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-transparent blur-2xl" />
      </div>

      <CardContent className="relative p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="capitalize">
                {paper.board?.name}
              </Badge>
              <Badge variant="secondary">Class {paper.class?.name}</Badge>
              <Badge variant="outline" className="capitalize">
                {paper.subject?.name}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => onView(paper)}
              className="mt-3 text-left w-full"
            >
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors capitalize">
                {paper.title}
              </h3>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formatDate(new Date(paper.createdAt))}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground justify-end">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{paper.examTime ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">{paper.totalMarks} marks</span>
          </div>
          <div className="text-muted-foreground text-right">
            <span className="font-medium">{(mcqs + shorts + longs).toLocaleString()}</span> questions
          </div>
        </div>

        <PaperStatsPills mcqs={mcqs} shorts={shorts} longs={longs} />

        <div className="space-y-2">
          <Button className="h-10 gap-2 w-full" onClick={() => onView(paper)}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="secondary" className="h-10 gap-2 w-full" onClick={() => onRecreate(paper)}>
              <RotateCcw className="h-4 w-4" />
              Create Another
            </Button>
            <DeletePaperDialogButton
              onConfirm={() => onDelete(paper)}
              disabled={deleteDisabled}
              variant="outline"
              buttonLabel="Delete"
              fullWidth
            />
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="capitalize">Paper ID: {paper.id.slice(-6)}</span>
          <span className="capitalize">{paper.subject?.slug}</span>
        </div>
      </CardContent>
    </Card>
  );
}
