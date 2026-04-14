/**
 * Public Talents API
 * Endpoints for browsing and viewing public talent profiles
 * No authentication required
 */

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3000/api/v1";

export interface TalentPublicProfile {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  bio?: string;
  skills: string[];
  stack: Array<string | { name: string }>;
  location: string;
  availability: string[];
  category: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  hiredCount?: number;
  views: number;
  isFeatured: boolean;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  services?: Array<{
    id: string;
    title: string;
    about: string;
    price?: string;
    images: string[];
    tags: string[];
    averageRating: number;
    totalReviews: number;
  }>;
}

export interface BrowseTalentsParams {
  q?: string;
  category?: string;
  headline?: string;
  skills?: string;
  stack?: string;
  location?: string;
  availability?: string;
  isFeatured?: boolean;
  sort?: "newest" | "oldest";
  limit?: number;
  offset?: number;
}

/**
 * Browse/Search public talent profiles
 * GET /api/v1/talents
 */
export async function browseTalents(
  params?: BrowseTalentsParams,
): Promise<TalentPublicProfile[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${baseUrl}/talents${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Disable caching for fresh data
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { message: errorText || response.statusText };
    }

    const errorMessage =
      errorData.message ||
      errorData.error ||
      `API Error: ${response.statusText}`;

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  const result = await response.json();
  // API returns {data: [...], pagination: {...}} format
  return result.data || result;
}

/**
 * Get a single public talent profile by ID
 * GET /api/v1/talents/:id
 * Automatically increments view count with IP-based tracking
 */
export async function getTalentProfile(
  id: string,
): Promise<TalentPublicProfile> {
  const url = `${baseUrl}/talents/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Disable caching for fresh data and view tracking
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { message: errorText || response.statusText };
    }

    const errorMessage =
      errorData.message ||
      errorData.error ||
      `API Error: ${response.statusText}`;

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}
