"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Chapter } from "@/lib/api/educationApi";
import CustomSpinner from "../shared/CustomSpinner";

export function ChapterMultiSelect({
  chapters,
  values,
  loading,
  onChange,
  onSubmit,
}: {
  chapters: Chapter[];
  values: string[];
  loading?: boolean;
  onChange: (ids: string[]) => void;
  onSubmit: () => void;
}) {
  const toggle = (id: string) => {
    const next = values.includes(id)
      ? values.filter((v) => v !== id)
      : [...values, id];
    onChange(next);
  };
  const allIds = chapters.map((c) => c.id);
  const allSelected = allIds.length > 0 && values.length === allIds.length;
  const selectAll = () => onChange(allIds);
  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm">Select Chapters</Label>
      <div className="flex items-center gap-2">
        <Button
          size="lg"
          className="w-48 h-12"
          variant="outline"
          onClick={selectAll}
          disabled={loading || !chapters.length}
        >
          Select All
        </Button>
        <Button
          size="lg"
          className="w-48 h-12"
          variant="ghost"
          onClick={clearAll}
          disabled={!values.length}
        >
          Clear
        </Button>
        <div className="text-muted-foreground text-xs">
          {allSelected ? "All selected" : `${values.length} selected`}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {loading ? (
          <CustomSpinner />
        ) : chapters.length ? (
          chapters.map((ch) => (
            <label
              key={ch.id}
              className="flex items-center justify-between gap-3 rounded-md border p-3 bg-white h-16"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  Ch: {ch?.chapterNumber}
                </div>
                <span className="text-lg">{ch?.name}</span>
              </div>
              <Checkbox
                checked={values.includes(ch.id)}
                onCheckedChange={() => toggle(ch?.id)}
                className="border border-gray-800 w-6 h-6"
              />
            </label>
          ))
        ) : (
          <div className="text-muted-foreground">No chapters found.</div>
        )}
      </div>
      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className="w-48 h-12 cursor-pointer"
          onClick={onSubmit}
          disabled={!values.length}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
