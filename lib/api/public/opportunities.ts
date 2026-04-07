/**
 * Public Opportunities API
 * Endpoints for browsing and viewing public opportunities
 * Authentication optional (enhanced with auth)
 */

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3000/api/v1";

export interface OpportunityPublicProfile {
  id: string;
  type: "job" | "gig" | "contract" | "internship";
  title: string;
  description: string;
  requirements?: string[];
  keyResponsibilities?: string[];
  company: string;
  logo?: string;
  employmentType?: string;
  location: string;
  compensation?: string;
  priceMode?: "fixed" | "range";
  price?: number;
  minBudget?: number;
  maxBudget?: number;
  paymentType?: "hourly" | "weekly" | "monthly";
  tags: string[];
  category: string;
  experienceLevel?: string;
  status: "active" | "closed" | "draft";
  views: number;
  applicationCount?: number;
  isFeatured: boolean;
  postedBy: {
    id: string;
    username: string;
    company: string;
    verificationStatus?: "approved" | "pending" | "rejected" | null;
  };
  hasApplied?: boolean;
  userApplicationStatus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrowseOpportunitiesParams {
  q?: string;
  type?: "job" | "gig" | "contract" | "internship";
  title?: string;
  location?: string;
  tags?: string;
  status?: "active" | "closed" | "draft";
  postedById?: string;
  isFeatured?: boolean;
  category?: string;
  experienceLevel?: string;
  minBudget?: number;
  maxBudget?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  talentId?: string;
}

/**
 * Browse/Search public opportunities
 * GET /api/v1/opportunities
 * Authentication optional - when authenticated, includes user's application status
 */
export async function browseOpportunities(
  params?: BrowseOpportunitiesParams,
  accessToken?: string,
): Promise<OpportunityPublicProfile[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${baseUrl}/opportunities${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token provided
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
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
 * Get a single public opportunity by ID
 * GET /api/v1/opportunities/:id
 * Authentication optional - when authenticated, includes user's application status
 * Automatically increments view count with IP-based tracking
 */
export async function getOpportunityProfile(
  id: string,
  accessToken?: string,
): Promise<OpportunityPublicProfile> {
  const url = `${baseUrl}/opportunities/${id}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token provided
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
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

  return response.json();
}
