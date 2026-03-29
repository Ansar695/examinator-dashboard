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
  const allTopicKeys = chapters.flatMap((c) =>
    (c.subTopics || []).map((t) => `${c.id}::${t}`)
  );
  const allSelected = allTopicKeys.length > 0 && values.length === allTopicKeys.length;
  const selectAll = () => onChange(allTopicKeys);
  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm">Select Chapters & Subtopics</Label>
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
            <div
              key={ch.id}
              className="flex flex-col gap-3 rounded-md border p-3 bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    Ch: {ch?.chapterNumber}
                  </div>
                  <span className="text-lg">{ch?.name}</span>
                </div>
                <Checkbox
                  checked={
                    (ch.subTopics?.length || 0) > 0 &&
                    ch.subTopics?.every((t) => values.includes(`${ch.id}::${t}`))
                  }
                  onCheckedChange={() => {
                    const topicKeys = (ch.subTopics || []).map((t) => `${ch.id}::${t}`);
                    if (!topicKeys.length) return;
                    const allSelected = topicKeys.every((k) => values.includes(k));
                    const next = allSelected
                      ? values.filter((v) => !topicKeys.includes(v))
                      : Array.from(new Set([...values, ...topicKeys]));
                    onChange(next);
                  }}
                  className="border border-gray-800 w-6 h-6"
                />
              </div>
              <div className="flex flex-col gap-2 pl-2">
                {ch.subTopics?.length ? (
                  ch.subTopics.map((t) => (
                    <label
                      key={`${ch.id}::${t}`}
                      className="flex items-center justify-between gap-3 rounded-md border p-2 bg-gray-50"
                    >
                      <span className="text-sm">{t}</span>
                      <Checkbox
                        checked={values.includes(`${ch.id}::${t}`)}
                        onCheckedChange={() => toggle(`${ch.id}::${t}`)}
                        className="border border-gray-800 w-5 h-5"
                      />
                    </label>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground">
                    No subtopics found for this chapter.
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">No chapters found.</div>
        )}
      </div>
      <div className="w-full flex items-end justify-end mt-6">
        <Button
          className="w-48 h-12 cursor-pointer active:bg-green-800"
          onClick={onSubmit}
          disabled={!values.length}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
