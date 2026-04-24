"use client";
import React from "react";
import { Search, Grid3x3, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneratedPapersFiltersProps {
    handleSearch: (e: any) => void
    handleSubjectFilter: (val: string) => void
    subjectsLoading: boolean
    subjects: any;
    viewMode: string
    setViewMode: any;
    filters: {
        search: string;
        subjectIds: string[]
    }
}

const GeneratedPapersFilters = (props: GeneratedPapersFiltersProps) => {
    const { filters, handleSearch, handleSubjectFilter, subjectsLoading, subjects, viewMode, setViewMode } = props
  return (
    <Card className="shadow-sm border-1 hover:shadow-xl transition-shadow py-0">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search papers by title..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-1 border-gray-300 pl-10 h-12"
            />
          </div>

          <Select
            onValueChange={handleSubjectFilter}
            disabled={subjectsLoading}
          >
            <SelectTrigger className="w-full md:w-[250px] h-12 min-h-12 border-1 border-gray-300">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects?.map((subject: any) => (
                <SelectItem key={subject?.id} value={subject?.id}>
                  {subject?.name}
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
      </CardContent>
    </Card>
  );
};

export default GeneratedPapersFilters;
