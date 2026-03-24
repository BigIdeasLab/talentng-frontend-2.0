"use client";

import { useParams } from "next/navigation";
import { useTalentProfile } from "@/hooks";
import { useRequireRole } from "@/hooks/useRequireRole";
import { ProfileLoadingState } from "@/components/talent/profile/components/ProfileLoadingState";
import { TalentProfileView as RecruiterTalentProfileView } from "@/components/employer/talent-profile/TalentProfileView";
import { TalentProfileView as PublicTalentProfileView } from "@/components/talent/public-profile/TalentProfileView";

export default function TalentProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const isRecruiter = useRequireRole(["recruiter"]);

  const { data: profile, isLoading, error, isError } = useTalentProfile(userId);

  // Show loading state while fetching or retrying
  if (isLoading) {
    return <ProfileLoadingState />;
  }

  // Only show error if query has actually failed (not during retries)
  if (isError && error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-black mb-2">
            Failed to load profile
          </h2>
          <p className="text-sm text-[#525866]">
            {error?.message || "Profile not found"}
          </p>
        </div>
      </div>
    );
  }

  // Show loading if we don't have profile data yet (shouldn't happen with proper loading state)
  if (!profile) {
    return <ProfileLoadingState />;
  }

  // Show recruiter view if user has recruiter role
  if (isRecruiter) {
    return <RecruiterTalentProfileView profile={profile} />;
  }

  // Show public view for others
  return <PublicTalentProfileView profile={profile} />;
}
