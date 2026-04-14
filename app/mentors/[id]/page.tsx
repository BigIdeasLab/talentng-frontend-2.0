import { Metadata } from "next";
import Link from "next/link";
import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicCTA } from "@/components/public/PublicCTA";
import { MentorDetailPublic } from "@/components/public/mentor/MentorDetailPublic";
import { getMentorProfile } from "@/lib/api/public/mentors";
import { getMentorPublicProfile } from "@/lib/mock-data/mentors-detail";

interface MentorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: MentorDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const mentor = await getMentorProfile(id);

    return {
      title: `${mentor.fullName} - ${mentor.headline} | Talents.ng`,
      description:
        mentor.bio ||
        `Book a mentorship session with ${mentor.fullName}, ${mentor.headline}`,
      openGraph: {
        title: `${mentor.fullName} - ${mentor.headline}`,
        description:
          mentor.bio || `Book a mentorship session with ${mentor.fullName}`,
        images: mentor.profileImageUrl ? [mentor.profileImageUrl] : [],
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title: `${mentor.fullName} - ${mentor.headline}`,
        description:
          mentor.bio || `Book a mentorship session with ${mentor.fullName}`,
        images: mentor.profileImageUrl ? [mentor.profileImageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Mentor Not Found | Talents.ng",
    };
  }
}

export default async function MentorDetailPage({
  params,
}: MentorDetailPageProps) {
  const { id } = await params;
  let mentorData;

  try {
    // Try to fetch from API first
    const mentor = await getMentorProfile(id);

    // Transform API response to match component interface
    mentorData = {
      id: mentor.id,
      name: mentor.fullName,
      title: mentor.headline,
      company: mentor.category,
      avatar: mentor.profileImageUrl || "/default.png",
      location: mentor.location || "",
      rating: mentor.avgRating || 0,
      totalReviews: 0,
      totalSessions: mentor.totalSessions || 0,
      sessionDuration: 60,
      bio: mentor.bio || "",
      expertise: mentor.expertise || [],
      industries: mentor.industries || [],
      stack: mentor.stack || [],
      reviews: [],
    };
  } catch (error) {
    // Fallback to mock data if API fails
    const mockData = getMentorPublicProfile(id);
    if (mockData) {
      mentorData = mockData;
    } else {
      // If no mock data either, show error
      return (
        <div className="font-inter-tight bg-white min-h-screen flex flex-col">
          <PublicNavbar activeLink="Mentors" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-gray-500 text-lg">Mentor not found</p>
              <Link
                href="/mentors"
                className="inline-flex px-6 py-3 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26d4] transition-colors"
              >
                Back to Mentors
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
      <PublicNavbar activeLink="Mentors" />
      <MentorDetailPublic data={mentorData} />
      <PublicCTA
        title="Ready to book a session?"
        subtitle="Join Talents.ng to connect with experienced mentors"
        ctaText="Sign Up to Book Session"
        ctaHref="/signup"
      />
      <PublicFooter />
    </div>
  );
}
