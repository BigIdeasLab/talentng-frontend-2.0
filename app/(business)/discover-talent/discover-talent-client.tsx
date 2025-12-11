"use client";

import { useState, useRef } from "react";
import {
  DiscoverTalentHeader,
  TalentGrid,
  TalentGridSkeleton,
} from "@/components/DiscoverTalent";
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
  const [pagination, setPagination] = useState<any>(null);
  const LIMIT = 20;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const fetchTalents = async (
    query: string,
    category: string,
    appliedFilters: FilterState | null,
    pageOffset: number = 0,
  ) => {
    // Only show loading skeleton on initial load, not on filter/category changes
    if (isInitialLoadRef.current) {
      setLoading(true);
    }
    setError(null);

    try {
      const {
        talents: newTalents,
        pagination: newPagination,
        error: fetchError,
      } = await getDiscoverTalentData({
        searchQuery: query,
        category: appliedFilters && appliedFilters.categories.length > 0 ? appliedFilters.categories.join(",") : category,
        skills: appliedFilters?.skills || [],
        location: appliedFilters?.location,
        availability: appliedFilters?.availability,
        limit: LIMIT,
        offset: pageOffset,
      });
      setTalents(newTalents);
      setPagination(newPagination);
      setError(fetchError);
      setOffset(pageOffset);
      isInitialLoadRef.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch talents");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      fetchTalents(query, selectedCategory, filters, 0);
    }, 500);
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
        isLoading={loading}
      />
      {loading && <TalentGridSkeleton />}
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
          hasNextPage={pagination?.hasNextPage || false}
          hasPreviousPage={pagination?.hasPreviousPage || false}
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
        />
      )}
    </div>
  );
}
