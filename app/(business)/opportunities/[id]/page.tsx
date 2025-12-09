import { OpportunityDetails } from "@/components/employer/opportunities/OpportunityDetails";

export default function OpportunityPage({ params }: { params: { id: string } }) {
  return <OpportunityDetails opportunityId={params.id} />;
}
