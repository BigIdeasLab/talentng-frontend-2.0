"use client";

import { useState, useMemo } from "react";
import { DiscoverTalentHeader, TalentGrid } from "@/components/DiscoverTalent";
import { Spinner } from "@/components/ui/spinner";
import { getDiscoverTalentData } from "./server-data";
import { filterTalents } from "@/lib/filters/talent-filter";
import type { TalentData } from "./server-data";
import type { FilterState } from "@/components/DiscoverTalent";

interface DiscoverTalentClientProps {
  initialTalents: TalentData[];
  initialError: string | null;
}

export function DiscoverTalentClient({
  initialTalents,
  initialError,
}: DiscoverTalentClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [talents, setTalents] = useState<TalentData[]>(initialTalents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [filters, setFilters] = useState<FilterState | null>(null);

  const handleSearch = async (query: string, category?: string) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);

    try {
      const { talents: newTalents, error: fetchError } =
        await getDiscoverTalentData(query, category);
      setTalents(newTalents);
      setError(fetchError);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch talents");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    handleSearch(searchQuery, category);
  };

  const handleFilterApply = (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
  };

  const filteredTalents = useMemo(() => {
    if (!filters) return talents;
    return filterTalents(talents, filters, searchQuery);
  }, [talents, filters, searchQuery]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <DiscoverTalentHeader
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onFilterApply={handleFilterApply}
      />
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {error && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}
      {!loading && !error && <TalentGrid talents={filteredTalents} />}
    </div>
  );
}
