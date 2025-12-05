"use client";

import { useState } from "react";
import { DiscoverTalentHeader, TalentGrid } from "@/components/DiscoverTalent";
import { Spinner } from "@/components/ui/spinner";
import { getDiscoverTalentData } from "./server-data";
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
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  const fetchTalents = async (
    query: string,
    category: string,
    appliedFilters: FilterState | null,
    pageOffset: number = 0,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { talents: newTalents, error: fetchError } =
        await getDiscoverTalentData({
          searchQuery: query,
          category,
          skills: appliedFilters?.skills || [],
          location: appliedFilters?.location,
          availability: appliedFilters?.availability,
          limit: LIMIT,
          offset: pageOffset,
        });
      setTalents(newTalents);
      setError(fetchError);
      setOffset(pageOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch talents");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    fetchTalents(query, selectedCategory, filters, 0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchTalents(searchQuery, category, filters, 0);
  };

  const handleFilterApply = (appliedFilters: FilterState) => {
    setFilters(appliedFilters);
    fetchTalents(searchQuery, selectedCategory, appliedFilters, 0);
  };

  const handleNextPage = () => {
    fetchTalents(searchQuery, selectedCategory, filters, offset + LIMIT);
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      fetchTalents(searchQuery, selectedCategory, filters, offset - LIMIT);
    }
  };

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
      {!loading && !error && (
        <TalentGrid
          talents={talents}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          hasNextPage={talents.length >= LIMIT}
          hasPreviousPage={offset > 0}
          currentPage={Math.floor(offset / LIMIT) + 1}
        />
      )}
    </div>
  );
}
