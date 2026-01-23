"use client";

import { TalentProfile } from "@/components/talent/profile/TalentProfile";
import { EmployerProfile } from "@/components/employer/profile/EmployerProfile";
import { MentorProfile } from "@/components/mentor/profile/MentorProfile";
import { Spinner } from "@/components/ui/spinner";
import { useProfile } from "@/hooks/useProfile";
import { mapAPIToUI } from "@/lib/profileMapper";
import { getCurrentProfile as getTalentProfile } from "@/lib/api/talent";
import { getCurrentRecruiterProfile } from "@/lib/api/recruiter";
import { getCurrentMentorProfile } from "@/lib/api/mentor";
import { useEffect, useState } from "react";

const DEFAULT_PROFILE_DATA = {
  personal: {
    firstName: "",
    lastName: "",
    headline: "",
    bio: "",
    phoneNumber: "",
    state: "",
    city: "",
    profileImageUrl: "",
  },
  professional: {
    role: "",
    company: "",
    category: "",
    description: "",
    skills: [],
    stack: [],
    availability: "",
  },
  gallery: [],
  experience: [],
  education: [],
  portfolio: {
    resumeUrl: "",
    portfolioItems: [],
  },
  social: {
    dribbble: "",
    telegram: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
};

export default function ProfilePage() {
  const { activeRole } = useProfile();
  const role = activeRole || "talent";
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data based on active role
  useEffect(() => {
    const fetchProfileByRole = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let profile = null;

        switch (role) {
          case "recruiter":
            profile = await getCurrentRecruiterProfile();
            break;
          case "mentor":
            profile = await getCurrentMentorProfile();
            break;
          case "talent":
          default:
            profile = await getTalentProfile();
            break;
        }

        if (profile) {
          // Transform to UI format
          const uiProfile = mapAPIToUI(profile);
          setProfileData(uiProfile);
        } else {
          setProfileData(DEFAULT_PROFILE_DATA);
        }
      } catch (err) {
        console.error(`[ProfilePage] Failed to fetch ${role} profile:`, err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
        setProfileData(DEFAULT_PROFILE_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileByRole();
  }, [role]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-blue-600" />
      </div>
    );
  }

  const displayProfile = profileData || DEFAULT_PROFILE_DATA;

  switch (role) {
    case "recruiter": {
      // Calculate profile completion percentage
      const recruiterProfile = profileData as any;
      const completionFields = [
        recruiterProfile?.professional?.company,
        recruiterProfile?.personal?.state,
        recruiterProfile?.professional?.description,
        recruiterProfile?.personal?.profileImageUrl,
        recruiterProfile?.professional?.category,
      ].filter(Boolean);
      const completionPercentage = Math.round(
        (completionFields.length / 5) * 100,
      );

      return (
        <EmployerProfile
           companyData={{
             name: recruiterProfile?.professional?.company || "Company Name",
             logo: recruiterProfile?.personal?.profileImageUrl,
             location: recruiterProfile?.personal?.state || "—",
             tagline: recruiterProfile?.professional?.description || "Employer",
           }}
          stats={{
            jobsPosted: 0,
            talentsHired: 0,
            responseTime: "—",
          }}
          completionPercentage={completionPercentage}
        />
      );
    }
    case "mentor": {
      return (
        <MentorProfile
          initialProfileData={displayProfile}
          initialUserId=""
          initialStats={null}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={error}
        />
      );
    }
    case "talent":
    default: {
      return (
        <TalentProfile
          initialProfileData={displayProfile}
          initialUserId=""
          initialStats={null}
          initialRecommendations={[]}
          initialServices={[]}
          initialError={error}
        />
      );
    }
  }
}
