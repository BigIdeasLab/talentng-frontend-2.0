"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { MentorGridSkeleton } from "@/components/talent/mentorship/MentorCardSkeleton";
import { MentorGrid } from "@/components/talent/mentorship/MentorGrid";
import {
  MentorFilterModal,
  type MentorFilterState,
} from "@/components/talent/mentorship/MentorFilterModal";

import { listMentors } from "@/lib/api/mentorship";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";

import categoriesData from "@/lib/data/categories.json";

const CATEGORIES = ["All", ...categoriesData];

interface MentorDisplay {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  rating: number;
  totalReviews: number;
  expertise: string[];
  company?: string;
  location?: string;
  category?: string;
}

function mapApiMentorToDisplay(mentor: Record<string, unknown>): MentorDisplay {
  // Get the image URL and ensure it's a local asset
  const rawImageUrl =
    (mentor.profileImageUrl as string) || (mentor.avatar as string) || "";
  const imageUrl =
    rawImageUrl && !rawImageUrl.includes("builder.io")
      ? rawImageUrl
      : "/default.png";

  return {
    id: (mentor.id as string) || "",
    name: (mentor.fullName as string) || (mentor.name as string) || "",
    title: (mentor.headline as string) || (mentor.title as string) || "",
    imageUrl,
    rating: Number(mentor.avgRating || mentor.rating || 0),
    totalReviews: (mentor.totalReviews as number) || 0,
    expertise: (mentor.expertise as string[]) || [],
    company: (mentor.company as string) || undefined,
    location: (mentor.location as string) || undefined,
    category: (mentor.category as string) || undefined,
  };
}

export default function MentorshipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const [mentors, setMentors] = useState<MentorDisplay[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  const [offset, setOffset] = useState(0);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const LIMIT = 20;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<MentorFilterState | null>(null);

  const hasAccess = useRequireRole(["talent"]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchIdRef = useRef(0);

  const fetchMentors = useCallback(
    async (
      query?: string,
      category?: string,
      filtersOverride?: MentorFilterState | null,
      pageOffset: number = 0,
    ) => {
      if (!hasAccess) return;
      const currentFetchId = ++fetchIdRef.current;

      try {
        setMentorsLoading(true);
        const searchQ = query !== undefined ? query : searchQuery;
        const filters =
          filtersOverride !== undefined ? filtersOverride : appliedFilters;
        const currentCategory =
          category !== undefined ? category : activeCategory;

        // Combine search query and headline/language filters for the API 'q' parameter
        let finalQuery = searchQ;
        const extraKeywords: string[] = [];

        if (filters?.headlines && filters.headlines.length > 0) {
          extraKeywords.push(...filters.headlines);
        }

        if (filters?.languages && filters.languages.length > 0) {
          extraKeywords.push(...filters.languages);
        }

        if (extraKeywords.length > 0) {
          const keywordsStr = extraKeywords.join(" ");
          finalQuery = finalQuery
            ? `${finalQuery} ${keywordsStr}`
            : keywordsStr;
        }

        const data = await listMentors({
          ...(finalQuery && finalQuery.length >= 2 && { q: finalQuery }),
          ...(currentCategory &&
            currentCategory !== "All" && { category: currentCategory }),
          ...(filters?.expertise &&
            filters.expertise.length > 0 && {
              expertise: filters.expertise.join(","),
            }),
          ...(filters?.location && { location: filters.location }),
          limit: LIMIT,
          offset: pageOffset,
        });

        // Discard stale responses
        if (currentFetchId !== fetchIdRef.current) return;

        // Handle both paginated and array response formats
        const raw = data as any;
        let mentorsArray: Record<string, unknown>[] = [];

        if (raw && typeof raw === "object" && "data" in raw) {
          mentorsArray = raw.data || [];
          // Extract pagination meta from API
          if (raw.meta) {
            setPagination({
              total: raw.meta.total || 0,
              page: raw.meta.page || 1,
              limit: raw.meta.limit || LIMIT,
              totalPages: raw.meta.totalPages || 1,
              hasNextPage: raw.meta.page < raw.meta.totalPages,
              hasPreviousPage: raw.meta.page > 1,
            });
          }
        } else if (Array.isArray(raw)) {
          mentorsArray = raw;
          setPagination(null);
        }

        setMentors(mentorsArray.map(mapApiMentorToDisplay));
        setOffset(pageOffset);
        setHasInitialLoaded(true);
      } catch (error) {
        if (currentFetchId !== fetchIdRef.current) return;
        console.error("Failed to load mentors:", error);
      } finally {
        setMentorsLoading(false);
      }
    },
    [hasAccess, searchQuery, appliedFilters, activeCategory],
  );

  useEffect(() => {
    fetchMentors();
  }, [hasAccess]);

  const handleMentorSearch = (query: string) => {
    if (query.length >= 2 || query.length === 0) {
      setOffset(0);
      fetchMentors(query, undefined, undefined, 0);
    }
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = category === "All" ? "" : category;
    setActiveCategory(newCategory);
    setOffset(0);
    fetchMentors(undefined, newCategory, undefined, 0);
  };

  const handleApplyFilters = (filters: MentorFilterState) => {
    setAppliedFilters(filters);
    setOffset(0);
    fetchMentors(undefined, undefined, filters, 0);
  };

  const handleNextPage = () => {
    const nextOffset = offset + LIMIT;
    fetchMentors(undefined, undefined, undefined, nextOffset);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    const prevOffset = Math.max(0, offset - LIMIT);
    fetchMentors(undefined, undefined, undefined, prevOffset);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hasAccess) {
    return <PageLoadingState message="Checking access..." />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen bg-white overflow-hidden">
      {/* Desktop: Static Header */}
      <div className="hidden md:block w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium text-black font-inter-tight leading-[16px] mb-[19px]">
          Mentorship
        </h1>

        {/* Search Bar and Filter */}
        <div className="flex items-center gap-[8px] mb-[19px]">
          <div className="flex-1 max-w-[585px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleMentorSearch}
              placeholder="Search mentors, topics..."
              debounceDelay={400}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
                appliedFilters &&
                (appliedFilters.headlines.length > 0 ||
                  appliedFilters.expertise.length > 0 ||
                  appliedFilters.languages.length > 0 ||
                  appliedFilters.location)
                  ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                  : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
              }`}
            >
              <SlidersHorizontal className="w-[15px] h-[15px]" />
              <span className="text-[13px] font-normal font-inter-tight">
                Filter
              </span>
              {appliedFilters &&
                appliedFilters.headlines.length +
                  appliedFilters.expertise.length +
                  appliedFilters.languages.length +
                  (appliedFilters.location ? 1 : 0) >
                  0 && (
                  <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {appliedFilters.headlines.length +
                      appliedFilters.expertise.length +
                      appliedFilters.languages.length +
                      (appliedFilters.location ? 1 : 0)}
                  </span>
                )}
            </button>

            <MentorFilterModal
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
              initialFilters={appliedFilters || undefined}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat === "All" ? "" : cat)}
              className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors font-inter-tight text-[13px] ${
                (activeCategory === "" && cat === "All") ||
                activeCategory === cat
                  ? "text-black font-medium border-b-2 border-black"
                  : "text-black/30 font-medium hover:text-black/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Simple scrollable layout */}
      {/* Mobile: Simple scrollable layout */}
      <div className="md:hidden flex-1 overflow-y-auto">
        {/* Header - scrolls with content */}
        <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA]">
          <h1 className="text-[16px] font-medium text-black font-inter-tight leading-[16px] mb-[19px]">
            Mentorship
          </h1>

          {/* Search Bar and Filter */}
          <div className="flex items-center gap-[8px]">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleMentorSearch}
                placeholder="Search mentors, topics..."
                debounceDelay={400}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
                  appliedFilters &&
                  (appliedFilters.headlines.length > 0 ||
                    appliedFilters.expertise.length > 0 ||
                    appliedFilters.languages.length > 0 ||
                    appliedFilters.location)
                    ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]"
                    : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent"
                }`}
              >
                <SlidersHorizontal className="w-[15px] h-[15px]" />
                <span className="text-[13px] font-normal font-inter-tight">
                  Filter
                </span>
                {appliedFilters &&
                  appliedFilters.headlines.length +
                    appliedFilters.expertise.length +
                    appliedFilters.languages.length +
                    (appliedFilters.location ? 1 : 0) >
                    0 && (
                    <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {appliedFilters.headlines.length +
                        appliedFilters.expertise.length +
                        appliedFilters.languages.length +
                        (appliedFilters.location ? 1 : 0)}
                    </span>
                  )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - sticky */}
        <div className="sticky top-0 z-10 w-full px-[25px] py-[12px] bg-white border-b border-[#E1E4EA]">
          <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat === "All" ? "" : cat)}
                className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors font-inter-tight text-[13px] ${
                  (activeCategory === "" && cat === "All") ||
                  activeCategory === cat
                    ? "text-black font-medium border-b-2 border-black"
                    : "text-black/30 font-medium hover:text-black/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {mentorsLoading && !hasInitialLoaded ? (
            <MentorGridSkeleton />
          ) : (
            <div
              id="mentors"
              className={`flex-1 flex flex-col transition-opacity duration-200 ${
                mentorsLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              <MentorGrid
                mentors={mentors}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                hasNextPage={pagination?.hasNextPage || false}
                hasPreviousPage={pagination?.hasPreviousPage || false}
                currentPage={pagination?.page || 1}
                totalPages={pagination?.totalPages || 1}
                totalMentors={pagination?.total}
                emptyTitle={
                  searchQuery.trim()
                    ? "No mentors match your search"
                    : appliedFilters &&
                        (appliedFilters.expertise.length > 0 ||
                          appliedFilters.headlines.length > 0 ||
                          appliedFilters.languages.length > 0 ||
                          appliedFilters.location)
                      ? "No mentors match your filters"
                      : activeCategory && activeCategory !== ""
                        ? "No mentors match your search"
                        : "No mentors yet"
                }
                emptyDescription={
                  searchQuery.trim()
                    ? "Try adjusting your search query"
                    : appliedFilters &&
                        (appliedFilters.expertise.length > 0 ||
                          appliedFilters.headlines.length > 0 ||
                          appliedFilters.languages.length > 0 ||
                          appliedFilters.location)
                      ? "Try adjusting your filters"
                      : activeCategory && activeCategory !== ""
                        ? `No mentors match your search in the "${activeCategory}" category`
                        : "Mentors will appear here as they join the platform"
                }
              />
            </div>
          )}
        </div>
        <MentorFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
          initialFilters={appliedFilters || undefined}
        />
      </div>

      {/* Desktop: Scrollable Content Area */}
      <div className="hidden md:flex flex-1 overflow-hidden flex-col">
        <div className="flex-1 flex flex-col overflow-hidden">
          {mentorsLoading && !hasInitialLoaded ? (
            <MentorGridSkeleton />
          ) : (
            <div
              id="mentors"
              className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-200 ${
                mentorsLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              <MentorGrid
                mentors={mentors}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                hasNextPage={pagination?.hasNextPage || false}
                hasPreviousPage={pagination?.hasPreviousPage || false}
                currentPage={pagination?.page || 1}
                totalPages={pagination?.totalPages || 1}
                totalMentors={pagination?.total}
                emptyTitle={
                  searchQuery.trim()
                    ? "No mentors match your search"
                    : appliedFilters &&
                        (appliedFilters.expertise.length > 0 ||
                          appliedFilters.headlines.length > 0 ||
                          appliedFilters.languages.length > 0 ||
                          appliedFilters.location)
                      ? "No mentors match your filters"
                      : activeCategory && activeCategory !== ""
                        ? "No mentors match your search"
                        : "No mentors yet"
                }
                emptyDescription={
                  searchQuery.trim()
                    ? "Try adjusting your search query"
                    : appliedFilters &&
                        (appliedFilters.expertise.length > 0 ||
                          appliedFilters.headlines.length > 0 ||
                          appliedFilters.languages.length > 0 ||
                          appliedFilters.location)
                      ? "Try adjusting your filters"
                      : activeCategory && activeCategory !== ""
                        ? `No mentors match your search in the "${activeCategory}" category`
                        : "Mentors will appear here as they join the platform"
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
