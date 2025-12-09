import { OpportunityCard } from "./opportunity-card";
import { EmptyState } from "./empty-state";
import type { OpportunitiesGridProps } from "./types";

export function OpportunitiesGrid({
  opportunities,
}: OpportunitiesGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 pb-6">
      {opportunities.length > 0 ? (
        opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
