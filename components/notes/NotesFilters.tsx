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
import { Search, GraduationCap, Users } from "lucide-react";
import ViewModeToggle, { PapersViewMode } from "@/components/teacher/generated-papers/ViewModeToggle";
import { useDebounce } from "@/hooks/useDebounce";
import { userTypeOptions } from "@/utils/static/userTypes";

interface NotesFilterProps {
  classes: Array<{ id: string; name: string }>;
  isAdmin: boolean;
  onFilterChange: (filters: {
    search: string;
    classId: string;
    userType: string;
  }) => void;
  isLoading?: boolean;
  viewMode?: string;
  setViewMode?: any;
}

export function NotesFilter({
  classes,
  onFilterChange,
  isLoading = false,
  isAdmin,
  viewMode = "list",
  setViewMode,
}: NotesFilterProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedUserType, setSelectedUserType] = useState("all");

  // Effect to trigger network requests only when debounced filters change
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      classId: selectedClass,
      userType: selectedUserType,
    });
  }, [debouncedSearch, selectedClass, selectedUserType]);

  return (
    <Card className="border shadow-sm bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by title or file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
              className="pl-10 h-12 border border-gray-300 hover:border-gray-400 transition-colors"
              inputMode="search"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3">
            <Select
              value={selectedClass}
              onValueChange={setSelectedClass}
              disabled={isLoading}
            >
              <SelectTrigger className="!h-12 w-full lg:w-[180px] border border-gray-300 hover:border-gray-400 transition-colors">
                <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    Class {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isAdmin && (
              <Select
                value={selectedUserType}
                onValueChange={setSelectedUserType}
                disabled={isLoading}
              >
                <SelectTrigger className="!h-12 w-full lg:w-[180px] border border-gray-300 hover:border-gray-400 transition-colors">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All User Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All User Types</SelectItem>
                  {userTypeOptions?.map((ut) => (
                    <SelectItem key={ut.value} value={ut.value}>
                      {ut.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {setViewMode && (
              <div className="hidden sm:flex ml-auto pl-2 border-l border-border h-12 items-center">
                <ViewModeToggle
                  value={viewMode as PapersViewMode}
                  onChange={setViewMode}
                />
              </div>
            )}
          </div>
          
          {/* Mobile View Toggle */}
          {setViewMode && (
            <div className="sm:hidden flex justify-end w-full border-t border-border pt-3 mt-1">
              <ViewModeToggle
                value={viewMode as PapersViewMode}
                onChange={setViewMode}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
