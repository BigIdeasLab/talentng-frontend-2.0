/**
 * Server-side data fetching for discover talent page
 * This runs on the server and passes data to client components
 * 
 * Uses centralized talent API from @/lib/api/talent-service
 */

import { talentDiscoveryApi } from "@/lib/api/talent-service";
import type { TalentProfile } from "@/lib/api/talent-service";

/**
 * TalentData - UI representation of TalentProfile
 * Search fields: fullName, headline, skills, location
 */
export interface TalentData {
  id: number;
  fullName: string;
  headline: string;
  location: string;
  timesHired: number;
  earnings: number;
  avatar: string;
  gallery: string[];
  skills: string[];
}

const mapTalentToUI = (profile: TalentProfile, index: number): TalentData => ({
  id: index + 1,
  fullName: profile.fullName || "Talent",
  headline: profile.headline || profile.category || "Professional",
  location: profile.location || "Not specified",
  timesHired: profile.stats?.hired || 0,
  earnings: parseInt(profile.stats?.earnings || "0"),
  avatar: profile.profileImageUrl || "/default-avatar.jpg",
  gallery: profile.gallery?.map((item) => item.url) || [],
  skills: profile.skills || [],
});

export async function getDiscoverTalentData(
  searchQuery?: string,
  category?: string,
) {
  try {
    const filters: any = {};
    if (searchQuery) filters.bio = searchQuery;
    if (category && category !== "All") filters.category = category;

    const profiles = await talentDiscoveryApi.listTalentProfiles(
      Object.keys(filters).length > 0 ? filters : undefined,
    );

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
