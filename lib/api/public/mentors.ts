/**
 * Public Mentors API
 * Endpoints for browsing and viewing public mentor profiles
 * No authentication required
 */

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3000/api/v1";

export interface MentorPublicProfile {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  headline: string;
  bio?: string;
  expertise: string[];
  industries: string[];
  languages: string[];
  stack: string[];
  location?: string;
  category: string;
  avgRating?: number | null;
  totalSessions: number;
  totalMentees: number;
  profileImageUrl?: string;
  coverImageUrl?: string;
  sessionDuration?: number;
  bufferTime?: number;
  advanceBookingDays?: number;
  cancellationPolicy?: string;
  autoAccept?: boolean;
  visibility: string;
  showStats?: boolean;
  views?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MentorReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string;
}

export interface MentorAvailability {
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}

export interface BrowseMentorsParams {
  q?: string;
  expertise?: string;
  industries?: string;
  location?: string;
  category?: string;
  languages?: string;
  stack?: string;
  isFeatured?: boolean;
  sortBy?: "createdAt" | "avgRating" | "totalSessions";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * Browse/Search public mentor profiles
 * GET /api/v1/mentors
 */
export async function browseMentors(
  params?: BrowseMentorsParams,
): Promise<MentorPublicProfile[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${baseUrl}/mentors${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

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
      errorData.message || errorData.error || `API Error: ${response.statusText}`;

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
 * Get a single public mentor profile by ID
 * GET /api/v1/mentors/:id
 * Automatically increments view count with IP-based tracking
 */
export async function getMentorProfile(
  id: string,
): Promise<MentorPublicProfile> {
  const url = `${baseUrl}/mentors/${id}`;

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
      errorData.message || errorData.error || `API Error: ${response.statusText}`;

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * Get reviews for a mentor
 * GET /api/v1/mentors/:id/reviews
 */
export async function getMentorReviews(
  id: string,
  params?: { limit?: number; offset?: number },
): Promise<MentorReview[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${baseUrl}/mentors/${id}/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

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
      errorData.message || errorData.error || `API Error: ${response.statusText}`;

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}

/**
 * Get mentor availability
 * GET /api/v1/mentors/:id/availability
 */
export async function getMentorAvailability(
  id: string,
  params?: { startDate?: string; endDate?: string },
): Promise<MentorAvailability[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${baseUrl}/mentors/${id}/availability${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

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
      errorData.message || errorData.error || `API Error: ${response.statusText}`;

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  return response.json();
}
