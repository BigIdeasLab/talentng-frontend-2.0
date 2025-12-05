"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getTalentProfileByUserId } from "@/lib/api/talent";
import type { TalentProfile } from "@/lib/api/talent/types";
import { TalentProfileView } from "@/components/talent/public-profile/TalentProfileView";

export default function TalentProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading talent profile</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  console.log(profile);
  return <TalentProfileView profile={profile} />;
}
