import { OpportunityDetails } from "@/components/employer/opportunities/OpportunityDetails";

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OpportunityDetails opportunityId={id} />;
}
