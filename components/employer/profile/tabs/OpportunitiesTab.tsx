"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useOpportunitiesManager } from "@/hooks/useOpportunitiesManager";
import { transformOpportunityToCard } from "@/lib/utils/opportunities";
import { OpportunityCard as OpportunityCardComponent } from "@/components/employer/opportunities/OpportunityCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";
import type { OpportunityCard } from "@/lib/types";

export function OpportunitiesTab() {
  const router = useRouter();
  const { currentProfile } = useProfile();
  const { getAll } = useOpportunitiesManager();
  const [opportunities, setOpportunities] = useState<OpportunityCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, [currentProfile]);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const userId = currentProfile?.userId;
      if (!userId) return;

      const response = await getAll({
        postedById: userId,
      });

      // Transform API response to card format and filter for open/active only
      const transformedOpportunities = (response.data || [])
        .map(transformOpportunityToCard)
        .filter((opp) => opp.status === "active");

      setOpportunities(transformedOpportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      setOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <p className="text-gray-500">Loading opportunities...</p>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <EmptyState
          icon={Briefcase}
          title="No open opportunities"
          description="You haven't posted any opportunities yet"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col gap-2 p-3 md:p-4 w-full max-w-[700px]">
        {opportunities.map((opportunity) => (
          <OpportunityCardComponent
            key={opportunity.id}
            opportunity={opportunity}
            activeTab="open"
            onMutationSuccess={fetchOpportunities}
          />
        ))}
      </div>
    </div>
  );
}
