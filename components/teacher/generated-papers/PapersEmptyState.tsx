"use client";

import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PapersEmptyStateProps = {
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function PapersEmptyState({
  title = "No papers yet",
  description = "Generate your first paper to start building an internal question-paper archive for your institution.",
  ctaHref = "/teacher/paper-builder",
  ctaLabel = "Create Paper",
}: PapersEmptyStateProps) {
  return (
    <Card className="p-10 md:p-14 text-center border border-dashed bg-card">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 via-sky-500/10 to-transparent flex items-center justify-center">
        <FileText className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mt-5">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">{description}</p>
      <div className="mt-6 flex justify-center">
        <Link href={ctaHref}>
          <Button className="gap-2 h-11 px-5">
            <Sparkles className="h-4 w-4" />
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

