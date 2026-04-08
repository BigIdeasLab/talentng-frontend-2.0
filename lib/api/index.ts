/**
 * Centralized API Client
 * Handles request configuration, authentication, and error handling
 * Uses localStorage for token storage and Authorization headers
 */

import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
  forceLogout,
} from "@/lib/auth";
import { setCookie } from "@/lib/utils";
import { ApiError } from "./errors";

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3001";

type ApiOptions = {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  credentials?: RequestCredentials;
};

let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;
const failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (success: boolean, error?: Error): void => {
  failedQueue.forEach((prom) => {
    if (success) {
      prom.resolve();
    } else {
      prom.reject(error || new Error("Token refresh failed"));
    }
  });
  failedQueue.length = 0;
};

const apiClient = async <T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> => {
  // Get access token from localStorage
  const accessToken = getAccessToken();

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add Authorization header if token exists
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  if (options.body) {
    if (options.body instanceof FormData) {
      delete (config.headers as Record<string, string>)["Content-Type"];
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  try {
    let response = await fetch(`${baseUrl}${endpoint}`, config);

    if (response.status === 401) {
      // Access token expired, try to refresh
      // If already refreshing, queue this request
      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: async () => {
              // Retry original request after refresh completes
              const newAccessToken = getAccessToken();
              const retryConfig = {
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              };
              fetch(`${baseUrl}${endpoint}`, retryConfig)
                .then(async (res) => {
                  if (!res.ok) {
                    const errBody = await res.text();
                    throw new ApiError(errBody || res.statusText, res.status);
                  }
                  return res.json();
                })
                .then(resolve)
                .catch(reject);
            },
            reject,
          });
        });
      }

      // Attempt to refresh the token using refresh token
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, user must log in again
        forceLogout();
        throw new Error("Session expired - please log in again");
      }

      isRefreshing = true;
      const currentActiveRole =
        typeof window !== "undefined"
          ? localStorage.getItem("activeRole")
          : null;
      refreshPromise = fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          refreshToken,
          ...(currentActiveRole ? { activeRole: currentActiveRole } : {}),
        }),
      });

      try {
        const refreshResponse = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();

          // Store new tokens in localStorage
          if (data.accessToken && data.refreshToken) {
            storeTokens({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              userId: data.userId || "",
            });

            // Preserve activeRole if it exists in localStorage
            // The refresh endpoint should maintain the same active role
            const currentActiveRole =
              typeof window !== "undefined"
                ? localStorage.getItem("activeRole")
                : null;
            if (currentActiveRole && typeof window !== "undefined") {
              localStorage.setItem("activeRole", currentActiveRole);
              setCookie("activeRole", currentActiveRole, 365);
            }
          }

          // Update config with new token and retry original request
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${data.accessToken}`,
          };

          processQueue(true);
          response = await fetch(`${baseUrl}${endpoint}`, config);
        } else {
          // Refresh failed, redirect to login
          processQueue(false, new Error("Token refresh failed"));
          forceLogout();
          throw new Error("Session expired - please log in again");
        }
      } catch (error) {
        processQueue(false, error as Error);
        isRefreshing = false;
        refreshPromise = null;
        forceLogout();
        throw error;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || response.statusText };
      }

      // Extract error message from backend response
      let errorMessage =
        errorData.message ||
        errorData.error ||
        "An error occurred during the API request.";

      // Handle NestJS validation errors which are often arrays (Phase 6.2 fix)
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.join(", ");
      }

      // Strip generic backend prefix if it's a string
      if (typeof errorMessage === "string") {
        errorMessage = errorMessage.replace(
          /^An unexpected error occurred:\s*/i,
          "",
        );
      }

      // Handle rate limiting errors (429)
      if (response.status === 429) {
        // Try to extract retry-after header
        const retryAfter = response.headers.get("retry-after");

        throw new ApiError(errorMessage, 429, {
          data: errorData,
          isRateLimit: true,
          retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
        });
      }

      // Handle specific error types with user-friendly messages
      if (
        errorMessage.includes("Transaction already closed") ||
        errorMessage.includes("transaction timeout")
      ) {
        errorMessage =
          "The request took too long to process. Please try again. If the problem persists, the server may be experiencing high load.";
      } else if (errorMessage.includes("Database error")) {
        errorMessage =
          "A database error occurred. Please try again in a moment.";
      } else if (response.status === 403) {
        // Special handling for role mismatch (Phase 6.1)
        if (
          errorMessage.toLowerCase().includes("role") ||
          errorMessage.toLowerCase().includes("permission") ||
          errorMessage.toLowerCase().includes("forbidden") ||
          errorMessage.toLowerCase().includes("access denied")
        ) {
          // Try to extract actual role from message "Your active role: recruiter"
          const roleMatch = errorMessage.match(
            /Your active role: ([a-zA-Z]+)/i,
          );

          const requiredRole =
            errorData.requiredRole ||
            (endpoint.includes("/recruiter")
              ? "recruiter"
              : endpoint.includes("/talent")
                ? "talent"
                : endpoint.includes("/mentor")
                  ? "mentor"
                  : undefined);

          throw new ApiError(errorMessage, 403, {
            data: errorData,
            isRoleMismatch: true,
            actualRole: roleMatch?.[1]?.toLowerCase(),
            requiredRole,
          });
        }
      }

      throw new ApiError(errorMessage, response.status, { data: errorData });
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : ({} as T);
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
};

export default apiClient;

// Re-export all API modules for convenience
// NOTE: Auth is now in auth-service.ts, not ./auth
export * from "./opportunities";
export * from "./applications";
export * from "./mentors";
export * from "./mentorship";
export * from "./notifications";
export * from "./learning-resources";
export * from "./users";
export * from "./talent";

// Export public APIs with specific exports to avoid conflicts
export {
  browseTalents,
  getTalentProfile as getPublicTalentProfile,
  type TalentPublicProfile,
  type BrowseTalentsParams,
} from "./public/talents";

export {
  browseRecruiters,
  getRecruiterProfile as getPublicRecruiterProfile,
  type RecruiterPublicProfile,
  type BrowseRecruitersParams,
} from "./public/recruiters";

export {
  browseMentors,
  getMentorProfile as getPublicMentorProfile,
  getMentorAvailability as getPublicMentorAvailability,
  type MentorPublicProfile,
  type MentorReview as PublicMentorReview,
  type MentorAvailability as PublicMentorAvailability,
  type BrowseMentorsParams,
} from "./public/mentors";

export {
  browseOpportunities,
  getOpportunityProfile as getPublicOpportunityProfile,
  type OpportunityPublicProfile,
  type BrowseOpportunitiesParams,
} from "./public/opportunities";
