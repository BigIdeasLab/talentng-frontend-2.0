"use client";

import { DiscoverTalentClient } from "./discover-talent-client";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";

export default function DiscoverTalentPage() {
  const { userRoles } = useProfile();
  const role = userRoles?.[0] || "talent";
  const [talents, setTalents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Add actual API call to fetch talents
        setTalents([]);
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
