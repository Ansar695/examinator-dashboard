"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewModeToggle, { type PapersViewMode } from "./ViewModeToggle";
import type { GeneratedPapersSortBy, GeneratedPapersSortOrder } from "@/types/generated-paper";

type SubjectOption = { id: string; name: string };

type PapersToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  subjectId: string;
  onSubjectChange: (value: string) => void;
  subjects: SubjectOption[];
  subjectsLoading?: boolean;
  sortBy: GeneratedPapersSortBy;
  sortOrder: GeneratedPapersSortOrder;
  onSortChange: (value: `${GeneratedPapersSortBy}:${GeneratedPapersSortOrder}`) => void;
  viewMode: PapersViewMode;
  onViewModeChange: (mode: PapersViewMode) => void;
};

export default function PapersToolbar({
  search,
  onSearchChange,
  subjectId,
  onSubjectChange,
  subjects,
  subjectsLoading,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
}: PapersToolbarProps) {
  return (
    <Card className="border shadow-sm bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11"
              inputMode="search"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
            <Select value={subjectId} onValueChange={onSubjectChange} disabled={subjectsLoading}>
              <SelectTrigger className="h-11 w-full lg:w-[240px]">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}:${sortOrder}`}
              onValueChange={(value) => onSortChange(value as `${GeneratedPapersSortBy}:${GeneratedPapersSortOrder}`)}
            >
              <SelectTrigger className="h-11 w-full lg:w-[240px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt:desc">Newest first</SelectItem>
                <SelectItem value="createdAt:asc">Oldest first</SelectItem>
                <SelectItem value="totalMarks:desc">Highest marks</SelectItem>
                <SelectItem value="totalMarks:asc">Lowest marks</SelectItem>
                <SelectItem value="title:asc">Title A-Z</SelectItem>
                <SelectItem value="title:desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-between sm:justify-end">
              <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

