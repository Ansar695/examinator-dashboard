"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GeneratedPaper } from "@/types/generated-paper";

type PaperPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paper: GeneratedPaper | null;
};

export default function PaperPreviewDialog({ open, onOpenChange, paper }: PaperPreviewDialogProps) {
  const previewHref = paper
    ? `/${paper.board.slug}/${paper.class.name}/${paper.subject.slug}/view-paper?paperId=${paper.id}&subjectId=${paper.subjectId}&embed=1`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 w-[92vw] max-w-[92vw] h-[92vh] max-h-[92vh] sm:w-[92vw] sm:max-w-[92vw] sm:h-[92vh] sm:max-h-[92vh] overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-5 py-4 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <DialogTitle className="text-base md:text-lg font-semibold truncate">
                  {paper ? paper.title : "Paper Preview"}
                </DialogTitle>
                {paper ? (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {paper.board.name} - Class {paper.class.name} - {paper.subject.name}
                  </p>
                ) : null}
              </div>
              {paper ? (
                <Link href={previewHref} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="h-10 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open in new tab
                  </Button>
                </Link>
              ) : null}
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 bg-muted/30 p-2 sm:p-3">
            {paper ? (
              <div className="w-full h-full rounded-xl overflow-hidden border bg-white shadow-sm">
                <iframe title="Paper preview" src={previewHref} className="w-full h-full bg-white" />
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
