"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Chapter } from "@/lib/api/educationApi";
import CustomSpinner from "../shared/CustomSpinner";
import { useMemo, useState } from "react";

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
  const [search, setSearch] = useState("");

  const toggle = (id: string) => {
    const next = values.includes(id)
      ? values.filter((v) => v !== id)
      : [...values, id];
    onChange(next);
  };
  const allTopicKeys = chapters.flatMap((c) =>
    (c.subTopics || []).map((t) => `${c.id}::${t}`)
  );
  const filteredChapters = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return chapters;
    return chapters
      .map((ch) => {
        const chapterMatch = ch.name?.toLowerCase().includes(term);
        const subTopics = (ch.subTopics || []).filter((t) =>
          t.toLowerCase().includes(term)
        );
        if (chapterMatch) return ch;
        if (subTopics.length) {
          return { ...ch, subTopics };
        }
        return null;
      })
      .filter(Boolean) as Chapter[];
  }, [chapters, search]);
  const allSelected = allTopicKeys.length > 0 && values.length === allTopicKeys.length;
  const selectAll = () => onChange(allTopicKeys);
  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm">Select Chapters & Subtopics</Label>
      <div className="flex flex-col gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chapter or subtopic..."
          className="h-11 border border-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <div className="text-xs text-muted-foreground">
          {search.trim()
            ? `Showing ${filteredChapters.length} chapter${filteredChapters.length === 1 ? "" : "s"}`
            : "Search filters chapters and subtopics locally."}
        </div>
      </div>
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
        ) : filteredChapters.length ? (
          filteredChapters.map((ch) => (
            <div
              key={ch.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
                  className="border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-6 h-6 rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2 pl-2">
                {ch.subTopics?.length ? (
                  ch.subTopics.map((t) => (
                    <label
                      key={`${ch.id}::${t}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/40 transition"
                    >
                      <span className="text-sm">{t}</span>
                      <Checkbox
                        checked={values.includes(`${ch.id}::${t}`)}
                        onCheckedChange={() => toggle(`${ch.id}::${t}`)}
                        className="border-2 border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-5 h-5 rounded-md"
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
          <div className="text-muted-foreground">
            {search.trim()
              ? "No chapters or subtopics match your search."
              : "No chapters found."}
          </div>
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
