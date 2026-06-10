"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface GlobalSearchProps {
  items: {
    slug: string;
    title: string;
    page_type: string;
    meta_description?: string | null;
  }[];
}

export function GlobalSearch({ items }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter items based on query
  const filteredItems = query.trim() === "" 
    ? [] 
    : items.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
        const descMatch = item.meta_description?.toLowerCase().includes(query.toLowerCase()) || false;
        return titleMatch || descMatch;
      }).slice(0, 8); // Limit to 8 suggestions for performance and layout

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (item: typeof items[0]) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/${item.slug}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto mb-8 z-50">
      {/* Search Input Wrapper */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate/60" />
        </div>
        <input
          type="text"
          placeholder="Search comparisons or reviews... (e.g. Notion, Figma)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="block w-full pl-11 pr-10 py-3.5 border border-hairline rounded-full bg-card/90 backdrop-blur-md text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/30 transition-all text-base shadow-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSelectedIndex(-1);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate/60 hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown */}
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-hairline bg-card/95 backdrop-blur-lg shadow-2xl overflow-hidden max-h-[380px] overflow-y-auto">
          <div className="py-2">
            {filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const isReview = item.page_type === "review";

              return (
                <div
                  key={item.slug}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-5 py-3 text-left cursor-pointer transition-colors flex items-start justify-between gap-4 border-b border-hairline-soft/50 last:border-b-0 ${
                    isSelected ? "bg-surface text-ink" : "text-slate hover:bg-surface/50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          isReview
                            ? "bg-brand-blue/15 text-brand-blue"
                            : "bg-brand-green/15 text-brand-green-deep"
                        }`}
                      >
                        {item.page_type}
                      </span>
                      <h4 className={`text-sm font-semibold transition-colors truncate ${
                        isSelected ? "text-brand-green-deep" : "text-ink"
                      }`}>
                        {item.title.split(":")[0]}
                      </h4>
                    </div>
                    {item.meta_description && (
                      <p className="text-xs text-slate line-clamp-1">
                        {item.meta_description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${
                    isSelected ? "translate-x-1 text-ink" : "text-slate/40"
                  }`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results Fallback */}
      {isOpen && query.trim() !== "" && filteredItems.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-hairline bg-card/95 backdrop-blur-lg shadow-2xl p-6 text-center">
          <p className="text-sm text-slate">
            No comparisons or reviews found for &quot;<span className="text-ink font-medium">{query}</span>&quot;
          </p>
        </div>
      )}
    </div>
  );
}
