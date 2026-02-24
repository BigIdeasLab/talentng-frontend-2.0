/**
 * Server-side data fetching for discover talent page
 * This runs on the server and passes data to client components
 *
 * Uses centralized talent API from @/lib/api/talent
 */

import { listTalentProfiles, type TalentProfile } from "@/lib/api/talent";

/**
 * TalentData - UI representation of TalentProfile
 * Search fields: fullName, headline, skills, location
 */
export interface TalentData {
  id: number;
  userId: string;
  fullName: string;
  headline: string;
  location: string;
  timesHired: number;
  earnings: number;
  avatar: string;
  gallery: string[];
  skills: string[];
  stack: string[];
}

const mapTalentToUI = (profile: TalentProfile, index: number): TalentData => {
  const gallery =
    profile.gallery
      ?.flatMap((item: any) => {
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
          return item.images;
        }
        if (item.url) {
          return [item.url];
        }
        return [];
      })
      .filter(Boolean) || [];

  return {
    id: index + 1,
    userId: profile.userId,
    fullName: profile.fullName || "Talent",
    headline: profile.headline || profile.category || "Professional",
    location: profile.location || "Not specified",
    timesHired: profile.stats?.hired || 0,
    earnings: parseInt(profile.stats?.earnings || "0"),
    avatar: profile.profileImageUrl || "/default-avatar.jpg",
    gallery,
    skills: profile.skills || [],
    stack:
      profile.stack?.map((s) => (typeof s === "string" ? s : s.name)) || [],
  };
};

export interface GetDiscoverTalentDataParams {
  searchQuery?: string;
  category?: string;
  skills?: string[];
  location?: string;
  availability?: string;
  limit?: number;
  offset?: number;
}

export interface PaginationData {
  total?: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetDiscoverTalentDataResponse {
  talents: TalentData[];
  pagination: PaginationData | null;
  error: string | null;
}

export async function getDiscoverTalentData(
  params: GetDiscoverTalentDataParams = {},
): Promise<GetDiscoverTalentDataResponse> {
  try {
    const {
      searchQuery,
      category,
      skills,
      location,
      availability,
      limit = 20,
      offset = 0,
    } = params;

    const filters: any = {};

    if (searchQuery) filters.q = searchQuery;
    if (category && category !== "All") filters.category = category;
    if (skills && skills.length > 0) filters.skills = skills.join(",");
    if (location) filters.location = location;
    if (availability && availability !== "All")
      filters.availability = availability;

    filters.limit = limit;
    filters.offset = offset;

    const response = await listTalentProfiles(filters);

    // Debug: log full raw API response
    console.log("[discover-talent] RAW API response:", JSON.stringify(response, null, 2));

    const talents = response.data.map(mapTalentToUI);

    return {
      talents,
      pagination: response.pagination,
      error: null,
    };
  } catch (error) {
    console.error("Error loading talents on server:", error);
    return {
      talents: [],
      pagination: null,
      error: error instanceof Error ? error.message : "Failed to load talents",
    };
  }
}
