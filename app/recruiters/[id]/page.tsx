import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicCTA } from "@/components/public/PublicCTA";
import { RecruiterDetailPublic } from "@/components/public/recruiter/RecruiterDetailPublic";
import { getRecruiterProfile } from "@/lib/api/public/recruiters";
import {
  browseOpportunities,
  type OpportunityPublicProfile,
} from "@/lib/api/public/opportunities";

interface RecruiterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: RecruiterDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const recruiter = await getRecruiterProfile(id);

    return {
      title: `${recruiter.company} - ${recruiter.industry} | Talents.ng`,
      description:
        recruiter.bio || `Explore opportunities at ${recruiter.company}`,
      openGraph: {
        title: `${recruiter.company} - ${recruiter.industry}`,
        description:
          recruiter.bio || `Explore opportunities at ${recruiter.company}`,
        images: recruiter.profileImageUrl ? [recruiter.profileImageUrl] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${recruiter.company} - ${recruiter.industry}`,
        description:
          recruiter.bio || `Explore opportunities at ${recruiter.company}`,
        images: recruiter.profileImageUrl ? [recruiter.profileImageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Recruiter Not Found | Talents.ng",
    };
  }
}

export default async function RecruiterDetailPage({
  params,
}: RecruiterDetailPageProps) {
  try {
    const { id } = await params;
    const recruiter = await getRecruiterProfile(id);

    // Fetch opportunities posted by this recruiter
    // Note: This may fail if the endpoint requires authentication for postedById filter
    let opportunities: OpportunityPublicProfile[] = [];
    try {
      opportunities = await browseOpportunities({
        postedById: recruiter.userId,
        status: "active",
        limit: 10,
      });
    } catch (oppError) {
      // Continue without opportunities - this is acceptable for public view
    }

    // Transform opportunities to match component interface
    const openPositions = opportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      type: opp.type,
      location: opp.location,
      postedDate: new Date(opp.createdAt).toLocaleDateString(),
    }));

    // Transform API response to match component interface
    const recruiterData = {
      id: recruiter.id,
      companyName: recruiter.company,
      industry: recruiter.industry,
      location: recruiter.location,
      jobsPosted: opportunities.length,
      talentsHired: 0, // Not available in API response
      description: recruiter.bio || "",
      hiringFor: [], // Not available in API response
      logoBg: "#5C30FF", // Default color
      initials: recruiter.company
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      companyLogo: recruiter.profileImageUrl,
      openPositions,
    };

    return (
      <div className="font-inter-tight bg-white min-h-screen">
        <PublicNavbar activeLink="Recruiters" />
        <RecruiterDetailPublic data={recruiterData} />
        <PublicCTA
          title="Ready to connect with top companies?"
          subtitle="Join Talents.ng to discover opportunities with leading employers"
          ctaText="Sign Up to Connect"
          ctaHref="/signup"
        />
        <PublicFooter />
      </div>
    );
  } catch (error) {
    return (
      <div className="font-inter-tight bg-white min-h-screen flex flex-col">
        <PublicNavbar activeLink="Recruiters" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-gray-500 text-lg">Recruiter not found</p>
            <Link
              href="/recruiters"
              className="inline-flex px-6 py-3 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26d4] transition-colors"
            >
              Back to Recruiters
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }
}
