import { OpportunityCard } from "./opportunity-card";
import { EmptyState } from "./empty-state";

type OpportunityType = "internship" | "job-listing" | "volunteer" | "part-time";
type ApplicationStatus = "awaiting-review" | "hired" | "not-hired";

interface Opportunity {
  id: string;
  posterName: string;
  posterAvatar?: string;
  date: string;
  type: OpportunityType;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
  applicationStatus?: ApplicationStatus;
}

interface OpportunitiesGridProps {
  opportunities: Opportunity[];
}

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
