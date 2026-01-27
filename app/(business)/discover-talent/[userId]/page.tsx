"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTalentProfileByUserId } from "@/lib/api/talent";
import type { TalentProfile } from "@/lib/api/talent/types";
import { useRequireRole } from "@/hooks/useRequireRole";
import { PageLoadingState } from "@/lib/page-utils";
import { TalentProfileView as RecruiterTalentProfileView } from "@/components/employer/talent-profile/TalentProfileView";
import { TalentProfileView as PublicTalentProfileView } from "@/components/talent/public-profile/TalentProfileView";

export default function TalentProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRecruiter = useRequireRole(["recruiter"]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getTalentProfileByUserId(userId);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch talent profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (isLoading) {
    return <PageLoadingState message="Loading talent profile..." />;
  }

  if (error || !profile) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-black mb-2">
            Failed to load profile
          </h2>
          <p className="text-sm text-[#525866]">
            {error || "Profile not found"}
          </p>
        </div>
      </div>
    );
  }

  // Show recruiter view if user has recruiter role
  if (isRecruiter) {
    return <RecruiterTalentProfileView profile={profile} />;
  }

  // Show public view for others
  return <PublicTalentProfileView profile={profile} />;
}
