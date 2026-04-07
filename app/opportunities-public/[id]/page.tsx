import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicCTA } from "@/components/public/PublicCTA";
import { OpportunityDetailPublic } from "@/components/public/opportunity/OpportunityDetailPublic";
import { getOpportunityProfile } from "@/lib/api/public/opportunities";

interface OpportunityDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: OpportunityDetailPageProps): Promise<Metadata> {
  try {
    const opportunity = await getOpportunityProfile(params.id);

    return {
      title: `${opportunity.title} at ${opportunity.company} | Talents.ng`,
      description: opportunity.description,
      openGraph: {
        title: `${opportunity.title} at ${opportunity.company}`,
        description: opportunity.description,
        images: opportunity.logo ? [opportunity.logo] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${opportunity.title} at ${opportunity.company}`,
        description: opportunity.description,
        images: opportunity.logo ? [opportunity.logo] : [],
      },
    };
  } catch (error) {
    return {
      title: "Opportunity Not Found | Talents.ng",
    };
  }
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  try {
    const opportunity = await getOpportunityProfile(params.id);

    // Transform API response to match component interface
    const opportunityData = {
      id: opportunity.id,
      title: opportunity.title,
      company: opportunity.company,
      companyLogo: opportunity.logo || "",
      companyLogoBg: "#5C30FF", // Default color
      companyInitials: opportunity.company
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      category: opportunity.category,
      type: opportunity.type,
      location: opportunity.location,
      experienceLevel: opportunity.experienceLevel || "Not specified",
      description: opportunity.description,
      keyResponsibilities: opportunity.keyResponsibilities || [],
      requirements: opportunity.requirements || [],
      skills: opportunity.tags,
      tools: [], // Not available in API response
      priceMode: "range" as const,
      minBudget: undefined,
      maxBudget: undefined,
      price: undefined,
      paymentType: undefined,
      startDate: undefined,
      duration: opportunity.employmentType,
      createdAt: new Date(opportunity.createdAt).toLocaleDateString(),
    };

    return (
      <div className="font-inter-tight bg-white min-h-screen">
        <PublicNavbar activeLink="Opportunities" />
        <OpportunityDetailPublic data={opportunityData} />
        <PublicCTA
          title="Ready to apply?"
          subtitle="Join Talents.ng to discover and apply for opportunities"
          ctaText="Sign Up to Apply"
          ctaHref="/signup"
        />
        <PublicFooter />
      </div>
    );
  } catch (error) {
    return (
      <div className="font-inter-tight bg-white min-h-screen flex flex-col">
        <PublicNavbar activeLink="Opportunities" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-gray-500 text-lg">Opportunity not found</p>
            <Link
              href="/opportunities-public"
              className="inline-flex px-6 py-3 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26d4] transition-colors"
            >
              Back to Opportunities
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }
}
