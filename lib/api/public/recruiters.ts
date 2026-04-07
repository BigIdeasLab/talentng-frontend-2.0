/**
 * Public Recruiters API
 * Endpoints for browsing and viewing public recruiter profiles
 * No authentication required
 */

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3000/api/v1";

export interface RecruiterPublicProfile {
  id: string;
  userId: string;
  username: string;
  company: string;
  industry: string;
  bio?: string;
  location: string;
  companySize?: string;
  companyStage?: string;
  operatingModel?: string;
  links?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  profileImageUrl?: string;
  coverImageUrl?: string;
  views: number;
  isFeatured: boolean;
  visibility: string;
  verificationStatus?: "approved" | "pending" | "rejected" | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrowseRecruitersParams {
  q?: string;
  company?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  companyStage?: string;
  operatingModel?: string;
  isFeatured?: boolean;
  sort?: "newest" | "oldest" | "views";
  limit?: number;
  offset?: number;
}

/**
 * Browse/Search public recruiter profiles
 * GET /api/v1/recruiters
 */
export async function browseRecruiters(
  params?: BrowseRecruitersParams,
): Promise<RecruiterPublicProfile[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${baseUrl}/recruiters${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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
 * Get a single public recruiter profile by ID
 * GET /api/v1/recruiters/:id
 * Attempts profile ID first, then falls back to user ID lookup
 * Automatically increments view count with IP-based tracking
 */
export async function getRecruiterProfile(
  id: string,
): Promise<RecruiterPublicProfile> {
  const url = `${baseUrl}/recruiters/${id}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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

  const data = await response.json();
  return data;
}
