import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicCTA } from "@/components/public/PublicCTA";
import { TalentDetailPublic } from "@/components/public/talent/TalentDetailPublic";
import { getTalentProfile } from "@/lib/api/public/talents";
import { getTalentPublicProfile } from "@/lib/mock-data/talents-detail";

interface TalentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: TalentDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const talent = await getTalentProfile(id);

    return {
      title: `${talent.fullName} - ${talent.headline} | Talents.ng`,
      description:
        talent.bio ||
        `View ${talent.fullName}'s profile, portfolio, and skills on Talents.ng`,
      openGraph: {
        title: `${talent.fullName} - ${talent.headline}`,
        description:
          talent.bio ||
          `View ${talent.fullName}'s profile, portfolio, and skills`,
        images: talent.profileImageUrl ? [talent.profileImageUrl] : [],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${talent.fullName} - ${talent.headline}`,
        description:
          talent.bio ||
          `View ${talent.fullName}'s profile, portfolio, and skills`,
        images: talent.profileImageUrl ? [talent.profileImageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Talent Not Found | Talents.ng",
    };
  }
}

export default async function TalentDetailPage({
  params,
}: TalentDetailPageProps) {
  const { id } = await params;
  let talentData;

  try {
    // Try to fetch from API first
    const talent = await getTalentProfile(id);

    // Transform API response to match component interface
    talentData = {
      userId: talent.userId,
      fullName: talent.fullName,
      headline: talent.headline,
      avatar: talent.profileImageUrl || "/default.png",
      location: talent.location,
      timesHired: talent.hiredCount || 0,
      availability: talent.availability,
      category: talent.category,
      bio: talent.bio,
      skills: talent.skills,
      stack: talent.stack.map((item: any) =>
        typeof item === "string" ? item : item.name,
      ),
      gallery: talent.coverImageUrl ? [talent.coverImageUrl] : [],
      services: talent.services
        ? talent.services.map((service: any) => ({
            id: service.id,
            title: service.title,
            about: service.about,
            price: service.price,
            images: service.images || [],
            tags: service.tags || [],
            averageRating: service.averageRating || 0,
            totalReviews: service.totalReviews || 0,
          }))
        : [],
      experience: [],
    };
  } catch (error) {
    // Fallback to mock data if API fails
    const mockData = getTalentPublicProfile(id);
    if (mockData) {
      talentData = mockData;
    } else {
      // If no mock data either, show error
      return (
        <div className="font-inter-tight bg-white min-h-screen flex flex-col">
          <PublicNavbar activeLink="Talents" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-gray-500 text-lg">Talent not found</p>
              <Link
                href="/talents"
                className="inline-flex px-6 py-3 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26d4] transition-colors"
              >
                Back to Talents
              </Link>
            </div>
          </div>
          <PublicFooter />
        </div>
      );
    }
  }

  return (
    <div className="font-inter-tight bg-white min-h-screen">
      <PublicNavbar activeLink="Talents" />
      <TalentDetailPublic data={talentData} />
      <PublicCTA
        title={`Ready to hire ${talentData.fullName.split(" ")[0]}?`}
        subtitle="Join Talents.ng to connect with skilled professionals"
        ctaText="Sign Up to Hire"
        ctaHref="/signup"
      />
      <PublicFooter />
    </div>
  );
}
