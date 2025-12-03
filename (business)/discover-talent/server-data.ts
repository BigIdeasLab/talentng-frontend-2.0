/**
 * Server-side data fetching for discover talent page
 * This runs on the server and passes data to client components
 */

import { listTalentProfiles } from "@/lib/api/talent";
import type { TalentProfile } from "@/lib/api/talent";

export interface TalentData {
  id: number;
  name: string;
  role: string;
  location: string;
  timesHired: number;
  earnings: number;
  avatar: string;
  gallery: string[];
  skills: string[];
}

const mapTalentToUI = (profile: TalentProfile, index: number): TalentData => ({
   id: index + 1,
   name: profile.fullName || profile.headline || "Talent",
   role: profile.headline || profile.category || "Professional",
   location: profile.location || "Not specified",
   timesHired: profile.stats?.hired || 0,
   earnings: parseInt(profile.stats?.earnings || "0"),
   avatar: profile.profileImageUrl || "/default-avatar.jpg",
   gallery: profile.gallery?.map((item) => item.url) || [],
   skills: profile.skills || [],
 });

export async function getDiscoverTalentData(searchQuery?: string) {
  try {
    const filters = searchQuery ? { bio: searchQuery } : undefined;
    const profiles = await listTalentProfiles(filters);

    const talents = profiles.map(mapTalentToUI);

    return {
      talents,
      error: null,
    };
  } catch (error) {
    console.error("Error loading talents on server:", error);
    return {
      talents: [],
      error: error instanceof Error ? error.message : "Failed to load talents",
    };
  }
}
