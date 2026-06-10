"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/review-card";
import type { GeneratedPage } from "@/lib/types";
import { Search, X, Zap } from "lucide-react";

interface SearchableReviewsProps {
  initialPages: GeneratedPage[];
}

export function SearchableReviews({ initialPages }: SearchableReviewsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = initialPages.filter((page) => {
    const titleMatch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = page.meta_description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    // Extract tool name if possible (e.g. Notion Review from Notion Review (2026))
    const titleParts = page.title.split(" Review");
    const toolName = titleParts[0]?.toLowerCase() || "";
    const toolNameMatch = toolName.includes(searchQuery.toLowerCase());

    return titleMatch || descMatch || toolNameMatch;
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
          id="reviews-search-input"
          placeholder="Search reviews (e.g. Notion, Asana, ClickUp...)"
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

      {/* Grid of reviews */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPages.map((page) => (
            <ReviewCard key={page.id} page={page} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-hairline rounded-lg bg-surface">
          <Zap className="h-10 w-10 text-stone mx-auto mb-4" />
          <h3 className="text-lg font-medium text-ink mb-2">
            No matches found
          </h3>
          <p className="text-sm text-slate">
            We couldn't find any reviews matching &quot;{searchQuery}&quot;. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
