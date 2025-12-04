"use client";

import { DiscoverTalentClient } from "./discover-talent-client";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { getDiscoverTalentData } from "./server-data";
import type { TalentData } from "./server-data";

export default function DiscoverTalentPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";
  const [talents, setTalents] = useState<TalentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { talents: fetchedTalents, error: fetchError } =
          await getDiscoverTalentData();
        setTalents(fetchedTalents);
        setError(fetchError);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  switch (role) {
    case "recruiter":
      return (
        <DiscoverTalentClient initialTalents={talents} initialError={error} />
      );
    case "mentor":
      return (
        <DiscoverTalentClient initialTalents={talents} initialError={error} />
      );
    case "talent":
    default:
      return (
        <DiscoverTalentClient initialTalents={talents} initialError={error} />
      );
  }
}
