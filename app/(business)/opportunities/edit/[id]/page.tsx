import { EditOpportunityForm } from "@/components/employer/opportunities/EditOpportunityForm";

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditOpportunityForm opportunityId={id} />;
}
