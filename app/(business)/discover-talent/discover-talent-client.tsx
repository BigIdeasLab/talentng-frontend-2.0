"use client";

import { useState, useRef, useEffect } from "react";
import { SearchInput } from "@/components/ui/search-input";
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
  initialPagination?: any;
}

export function DiscoverTalentClient({
  initialTalents,
  initialError,
  initialPagination,
}: DiscoverTalentClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [talents, setTalents] = useState<TalentData[]>(initialTalents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(initialError);
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [offset, setOffset] = useState(0);
  const [pagination, setPagination] = useState<any>(initialPagination);
  const LIMIT = 20;
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    fetchTalents(searchQuery, selectedCategory, filters, 0, sortBy);
  }, []);

  const fetchTalents = async (
    query: string,
    category: string,
    appliedFilters: FilterState | null,
    pageOffset: number = 0,
    sort: string = sortBy,
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
        category: category,
        skills: appliedFilters?.skills || [],
        stack: appliedFilters?.stack || [],
        location: appliedFilters?.location,
        availability: Array.isArray(appliedFilters?.availability)
          ? appliedFilters.availability.join(",")
          : undefined,
        headline: appliedFilters?.headline,
        sort,
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

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    fetchTalents(searchQuery, selectedCategory, filters, 0, sort);
  };

  const handleNextPage = () => {
    fetchTalents(
      searchQuery,
      selectedCategory,
      filters,
      offset + LIMIT,
      sortBy,
    );
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      fetchTalents(
        searchQuery,
        selectedCategory,
        filters,
        offset - LIMIT,
        sortBy,
      );
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
        sortBy={sortBy}
        onSortChange={handleSortChange}
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
          talents={[...talents].sort((a, b) => {
            if (sortBy === "newest") {
              return (
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
              );
            }
            if (sortBy === "oldest") {
              return (
                new Date(a.createdAt || 0).getTime() -
                new Date(b.createdAt || 0).getTime()
              );
            }
            return 0;
          })}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          hasNextPage={pagination?.hasNextPage || false}
          hasPreviousPage={pagination?.hasPreviousPage || false}
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          totalTalents={pagination?.total}
          emptyTitle={
            searchQuery.trim()
              ? "No talents found"
              : filters &&
                  ((filters.skills && filters.skills.length > 0) ||
                    (filters.stack && filters.stack.length > 0) ||
                    filters.location ||
                    filters.availability ||
                    filters.headline)
                ? "No talents found"
                : selectedCategory !== "All"
                  ? "No talents found"
                  : "No talents yet"
          }
          emptyDescription={
            searchQuery.trim()
              ? "Try adjusting your search query"
              : filters &&
                  ((filters.skills && filters.skills.length > 0) ||
                    (filters.stack && filters.stack.length > 0) ||
                    filters.location ||
                    filters.availability ||
                    filters.headline)
                ? "Try adjusting your filters"
                : selectedCategory !== "All"
                  ? `No talents found in the "${selectedCategory}" category`
                  : "Talents will appear here as they join the platform"
          }
        />
      )}
    </div>
  );
}
