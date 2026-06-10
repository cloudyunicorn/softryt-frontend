"use client";

import { useState } from "react";
import { ComparisonCard } from "@/components/comparison-card";
import type { GeneratedPage } from "@/lib/types";
import { Search, X, Zap } from "lucide-react";

interface SearchableComparisonsProps {
  initialPages: GeneratedPage[];
}

export function SearchableComparisons({ initialPages }: SearchableComparisonsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = initialPages.filter((page) => {
    const titleMatch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = page.meta_description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    // Extract tool names if possible for precise matching
    const titleParts = page.title.split(":");
    const toolNames = titleParts[0]?.toLowerCase() || "";
    const toolNamesMatch = toolNames.includes(searchQuery.toLowerCase());

    return titleMatch || descMatch || toolNamesMatch;
  });

  return (
    <div>
      {/* Search Input */}
      <div className="relative max-w-md mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate/60" />
        </div>
        <input
          type="text"
          id="comparisons-search-input"
          placeholder="Search comparisons (e.g. Notion, Coda, Jira...)"
          className="block w-full pl-11 pr-10 py-3 border border-hairline rounded-full bg-card text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/30 transition-all text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate/60 hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grid of comparisons */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPages.map((page) => (
            <ComparisonCard key={page.id} page={page} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-hairline rounded-lg bg-surface">
          <Zap className="h-10 w-10 text-stone mx-auto mb-4" />
          <h3 className="text-lg font-medium text-ink mb-2">
            No matches found
          </h3>
          <p className="text-sm text-slate">
            We couldn't find any comparisons matching &quot;{searchQuery}&quot;. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
