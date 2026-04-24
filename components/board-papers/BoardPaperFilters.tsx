"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, GraduationCap } from "lucide-react";
import ViewModeToggle, { PapersViewMode } from "@/components/teacher/generated-papers/ViewModeToggle";
import { useDebounce } from "@/hooks/useDebounce";

interface BoardNamesFilterProps {
  boardNames: Array<{ id: string; name: string }>;
  onFilterChange: (filters: { search: string; boardName: string; boardYear: string }) => void;
  isLoading?: boolean;
  viewMode?: string;
  setViewMode?: any;
}

export function BoardPaperFilters({
  boardNames,
  onFilterChange,
  isLoading = false,
  viewMode,
  setViewMode,
}: BoardNamesFilterProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const [selectedBoardName, setSelectedBoardName] = useState("all");
  const [selectedBoardYear, setSelectedBoardYear] = useState("all");

  // Effect to trigger network requests only when debounced filters change
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      boardName: selectedBoardName,
      boardYear: selectedBoardYear,
    });
  }, [debouncedSearch, selectedBoardName, selectedBoardYear]);

  return (
    <Card className="border shadow-sm bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by board name or file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              className="pl-10 h-12 border border-gray-300 hover:border-gray-400 transition-colors"
              inputMode="search"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
            <Select
              value={selectedBoardYear}
              onValueChange={setSelectedBoardYear}
              disabled={isLoading}
            >
              <SelectTrigger className="!h-12 w-full lg:w-[160px] border border-gray-300 hover:border-gray-400 transition-colors">
                <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Class {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBoardName}
              onValueChange={setSelectedBoardName}
              disabled={isLoading}
            >
              <SelectTrigger className="!h-12 w-full lg:w-[240px] border border-gray-300 hover:border-gray-400 transition-colors">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Boards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                {boardNames?.map((bn) => (
                  <SelectItem key={bn.id} value={bn.id}>
                    {bn.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-between sm:justify-end border-t border-border sm:border-0 pt-3 sm:pt-0">
              <ViewModeToggle
                value={viewMode as PapersViewMode}
                onChange={(mode) => setViewMode(mode)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
