"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, FileText, BookOpen, ScrollText, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SearchResult = {
  papers: any[];
  notes: any[];
  boardPapers: any[];
};

const SearchSkeleton = () => (
  <div className="py-2 space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="px-4">
        <div className="h-2 w-20 bg-muted rounded mb-3" />
        <div className="space-y-3">
          {[1, 2].map((j) => (
            <div key={j} className="flex gap-3 px-2">
              <div className="w-8 h-8 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        
        if (!response.ok) {
          setError(data.message || "Failed to search. Please try again.");
          setResults(null);
          return;
        }

        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setError("Network error. Please check your connection.");
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults(null);
    setError(null);
    setIsOpen(false);
  };

  const hasResults = results && 
    (Array.isArray(results.papers) && results.papers.length > 0 || 
     Array.isArray(results.notes) && results.notes.length > 0 || 
     Array.isArray(results.boardPapers) && results.boardPapers.length > 0);

  return (
    <div className="relative flex flex-1 max-w-[200px] sm:max-w-md mr-2" ref={dropdownRef}>
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className={`h-4 w-4 transition-colors ${isLoading ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"}`} />
        </div>
        
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search papers, notes, boards..."
          className="block h-10 sm:h-12 w-full border-border bg-muted/30 backdrop-blur-sm py-0 pl-10 pr-10 placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 hover:bg-muted/50 transition-all text-sm rounded-xl border-none shadow-sm"
        />

        {query && (
          <button 
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <X className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full max-h-[450px] overflow-y-auto rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
          {isLoading && <SearchSkeleton />}

          {!isLoading && error && (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <X className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-sm font-medium text-foreground">{error}</p>
            </div>
          )}

          {!isLoading && !error && !hasResults && query.length >= 2 && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-sm font-medium text-foreground">No matches found</p>
              <p className="text-xs mt-1">Try a different keyword or year</p>
            </div>
          )}

          {hasResults && (
            <div className="py-2">
              {/* Generated Papers */}
              {results?.papers && results.papers.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 flex items-center gap-2">
                    <FileText className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Generated Papers</span>
                  </div>
                  {results.papers.map((paper: any) => (
                    <Link
                      key={paper.id}
                      href={`/teacher/generated-papers?view=${paper.id}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 hover:bg-primary/5 transition-colors group mx-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{paper.title}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] py-0.5 px-1.5 rounded bg-blue-500/10 text-blue-600 font-medium">{paper.subject?.name}</span>
                          <span className="text-[10px] py-0.5 px-1.5 rounded bg-orange-500/10 text-orange-600 font-medium">{paper.class?.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Important Notes */}
              {results?.notes && results.notes.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 flex items-center gap-2 border-t border-border/50 mt-2 pt-4">
                    <BookOpen className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Important Notes</span>
                  </div>
                  {results.notes.map((note: any) => (
                    <Link
                      key={note.id}
                      href="/teacher/important-notes"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 hover:bg-emerald-500/5 transition-colors group mx-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors truncate">{note.notesTitle}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{note.board?.name} • {note.class?.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Board Papers */}
              {results?.boardPapers && results.boardPapers.length > 0 && (
                <div className="mb-1">
                  <div className="px-4 py-2 flex items-center gap-2 border-t border-border/50 mt-2 pt-4">
                    <ScrollText className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Board Papers</span>
                  </div>
                  {results.boardPapers.map((paper: any) => (
                    <Link
                      key={paper.id}
                      href="/teacher/all-boards-papers"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 hover:bg-orange-500/5 transition-colors group mx-2 rounded-lg"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground group-hover:text-orange-600 transition-colors truncate">{paper.boardName}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Year: {paper.boardYear}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
