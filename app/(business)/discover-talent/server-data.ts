/**
 * Server-side data fetching for discover talent page
 * This runs on the server and passes data to client components
 *
 * Uses recruiter-specific talent API endpoints
 */

import apiClient from "@/lib/api";
import type { TalentProfile } from "@/lib/api/talent/types";

/**
 * TalentData - UI representation of TalentProfile
 * Search fields: fullName, headline, skills, location
 */
export interface TalentData {
  id: string; // Changed from number to string to match actual talent profile ID
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
  availability: string[];
  category: string;
  createdAt: string;
}

const mapTalentToUI = (profile: TalentProfile): TalentData => {
  const gallery =
    profile.gallery
      ?.flatMap((item: any) => {
        if (
          item.images &&
          Array.isArray(item.images) &&
          item.images.length > 0
        ) {
          return item.images;
        }
        if (item.url) {
          return [item.url];
        }
        return [];
      })
      .filter(Boolean) || [];

  return {
    id: profile.id, // Use actual talent profile ID instead of artificial index
    userId: profile.userId,
    fullName: profile.fullName || "Talent",
    headline: profile.headline || profile.category || "Professional",
    location: profile.location || "Not specified",
    timesHired: profile.stats?.hired || 0,
    earnings: parseInt(profile.stats?.earnings || "0"),
    avatar: profile.profileImageUrl || "/default.png",
    gallery,
    skills: profile.skills || [],
    stack:
      profile.stack?.map((s) => (typeof s === "string" ? s : s.name)) || [],
    availability: Array.isArray(profile.availability)
      ? profile.availability
      : profile.availability
        ? [profile.availability]
        : [],
    category: profile.category || "",
    createdAt: profile.createdAt || new Date().toISOString(),
  };
};

export interface GetDiscoverTalentDataParams {
  searchQuery?: string;
  category?: string;
  skills?: string[];
  stack?: string[];
  location?: string;
  availability?: string;
  headline?: string;
  sort?: string;
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
      stack,
      location,
      availability,
      headline,
      sort,
      limit = 20,
      offset = 0,
    } = params;

    const filters: any = {};

    if (searchQuery) filters.q = searchQuery;
    if (category && category !== "All") filters.category = category;
    if (skills && skills.length > 0) filters.skills = skills.join(",");
    if (stack && stack.length > 0) filters.stack = stack.join(",");
    if (location) filters.location = location;
    if (availability && availability !== "All")
      filters.availability = availability;
    if (headline) filters.headline = headline;
    if (sort) filters.sort = sort;

    filters.limit = limit;
    filters.offset = offset;

    // Use recruiter-specific endpoint
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const query = queryParams.toString();
    const endpoint = query
      ? `/recruiter/talents?${query}`
      : "/recruiter/talents";

    const response = await apiClient<any>(endpoint);

    // Handle different response structures
    let talentsData: TalentProfile[];
    let paginationData: any = null;

    if (Array.isArray(response)) {
      // Response is directly an array
      talentsData = response;
    } else if (response.data && Array.isArray(response.data)) {
      // Response has paginated structure like the public endpoint
      talentsData = response.data;
      paginationData = response.pagination;
    } else {
      // Unexpected response structure
      console.error("Unexpected response structure:", response);
      throw new Error(
        "Invalid response format from recruiter talents endpoint",
      );
    }

    const talents = talentsData.map(mapTalentToUI);

    // Use provided pagination or create our own
    const pagination = paginationData || {
      total: talents.length,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(talents.length / limit),
      hasNextPage: offset + limit < talents.length,
      hasPreviousPage: offset > 0,
    };

    return {
      talents,
      pagination,
      error: null,
    };
  } catch (error) {
    console.error("Error loading talents on server:", error);

    // Log additional details for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        endpoint: `/recruiter/talents`,
      });
    }

    return {
      talents: [],
      pagination: null,
      error: error instanceof Error ? error.message : "Failed to load talents",
    };
  }
}
