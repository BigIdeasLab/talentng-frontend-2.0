"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useRecruiterOpportunitiesQuery } from "@/hooks/useRecruiterOpportunities";
import type {
  TabType,
  SortType,
  OpportunityCard,
  OpportunityType,
} from "@/lib/types";
import { transformOpportunityToCard } from "@/lib/utils/opportunities";
import { OpportunitiesHeader } from "./OpportunitiesHeader";
import { SearchAndFilters } from "./SearchAndFilters";
import { OpportunitiesTabs } from "./OpportunitiesTabs";
import { OpportunityCard as OpportunityCardComponent } from "./OpportunityCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";
import {
  OpportunitiesFilterModal,
  type OpportunitiesFilterState,
} from "@/components/talent/opportunities/OpportunitiesFilterModal";
import { RoleColorProvider } from "@/lib/theme/RoleColorContext";
import { OpportunitiesSkeleton } from "./OpportunitiesSkeleton";

export function EmployerOpportunities() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProfile } = useProfile();

  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const {
    data: opportunitiesRaw,
    isLoading,
    isPending,
    refetch: fetchOpportunities,
  } = useRecruiterOpportunitiesQuery();

  // Transform API response to card format
  const opportunities: OpportunityCard[] = (opportunitiesRaw?.data || []).map(
    transformOpportunityToCard,
  );

  // Handle tab from query params
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType | null;
    if (tabParam && ["open", "closed", "draft"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // fetchOpportunities handled by useQuery hook

  const handlePostClick = () => {
    router.push("/opportunities/post");
  };

  const getOpportunitiesByTab = () => {
    // Filter by status based on tab
    const statusMap: Record<TabType, string> = {
      open: "active",
      closed: "closed",
      draft: "draft",
    };

    const targetStatus = statusMap[activeTab];
    return opportunities.filter((opp) => opp.status === targetStatus);
  };

  const filteredOpportunities = getOpportunitiesByTab()
    .filter((opp) => {
      const matchesSearch =
        searchQuery === "" ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesFilters =
        !appliedFilters ||
        ((appliedFilters.types.length === 0 ||
          appliedFilters.types.includes(opp.type)) &&
          (appliedFilters.skills.length === 0 ||
            appliedFilters.skills.some((skill: string) =>
              opp.skills.includes(skill),
            )));

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
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
      if (sortBy === "rate-high") {
        const rateA = a.minBudget || a.price || 0;
        const rateB = b.minBudget || b.price || 0;
        return rateB - rateA;
      }
      if (sortBy === "rate-low") {
        const rateA = a.minBudget || a.price || 0;
        const rateB = b.minBudget || b.price || 0;
        return rateA - rateB;
      }
      return 0;
    });

  if (isLoading || isPending || !opportunitiesRaw) {
    return <OpportunitiesSkeleton />;
  }

  return (
    <RoleColorProvider role="recruiter">
      <div className="h-screen overflow-y-auto overflow-x-hidden bg-white">
        <div className="w-full mx-auto px-3 py-5 md:px-5 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <OpportunitiesHeader onPostClick={handlePostClick} />
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterClick={() => setIsFilterOpen(true)}
            />
          </div>

          <OpportunitiesFilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={(filters) => {
              setAppliedFilters(filters);
              setIsFilterOpen(false);
            }}
            availableSkills={[]}
            initialFilters={appliedFilters || undefined}
          />

          {/* Tabs */}
          <OpportunitiesTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Opportunities Grid or Empty State */}
          {filteredOpportunities.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No opportunities found"
              description="Try adjusting your search or filters to find what you're looking for"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCardComponent
                  key={opportunity.id}
                  opportunity={opportunity}
                  activeTab={activeTab}
                  onMutationSuccess={fetchOpportunities}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleColorProvider>
  );
}
