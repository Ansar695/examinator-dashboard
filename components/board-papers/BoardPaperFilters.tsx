"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3, List, Search, X } from "lucide-react";
import { userTypeOptions } from "@/utils/static/userTypes";

interface BoardNamesFilterProps {
  boardNames: Array<{ id: string; name: string }>;
  onFilterChange: (filters: { search: string; boardName: string }) => void;
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
  const [selectedBoardName, setSelectedBoardName] = useState("all");
  const [selectedUserType, setSelectedUserType] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, boardName: selectedBoardName });
  };

  const handleBoardNameChange = (value: string) => {
    setSelectedBoardName(value);
    onFilterChange({ search, boardName: value });
  };

  const handleReset = () => {
    setSearch("");
    setSelectedBoardName("all");
    setSelectedUserType("all");
    onFilterChange({ search: "", boardName: "all" });
  };

  const hasActiveFilters = search || selectedBoardName !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10 backdrop-blur-sm">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by board name..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoading}
          className="pl-10 h-12 bg-background/60 border-primary/20 focus:border-primary/50"
        />
      </div>

      {/* Class Filter */}
      <Select
        value={selectedBoardName}
        onValueChange={handleBoardNameChange}
        disabled={isLoading}
      >
        <SelectTrigger className="min-h-12 w-full sm:w-56 bg-background/60 border-primary/20 focus:border-primary/50">
          <SelectValue placeholder="Filter by class..." />
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

      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
          className="h-11 w-11"
        >
          <Grid3x3 className="w-5 h-5" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
          className="h-11 w-11"
        >
          <List className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
