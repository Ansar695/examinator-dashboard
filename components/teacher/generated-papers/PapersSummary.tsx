"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PapersSummaryProps = {
  total: number;
  search?: string;
  subjectName?: string;
  onClearFilters: () => void;
};

export default function PapersSummary({ total, search, subjectName, onClearFilters }: PapersSummaryProps) {
  const hasFilters = Boolean((search && search.trim()) || subjectName);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">{total.toLocaleString()}</span> papers
        </p>
        {search && search.trim() ? <Badge variant="secondary">Search: {search.trim()}</Badge> : null}
        {subjectName ? <Badge variant="secondary">Subject: {subjectName}</Badge> : null}
      </div>
      {hasFilters ? (
        <Button variant="ghost" className="h-9 px-3 justify-start sm:justify-center" onClick={onClearFilters}>
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}

