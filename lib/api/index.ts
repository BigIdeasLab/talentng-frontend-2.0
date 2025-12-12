/**
 * Centralized API Client
 * Handles request configuration, authentication, and error handling
 * Uses Authorization header with localStorage tokens
 */

import { getAccessToken, clearTokens } from "@/lib/auth";
import { ensureValidToken, queueRequest, resetRefreshState } from "@/lib/token-refresh";

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3001";

type ApiOptions = {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  credentials?: RequestCredentials;
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
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
  options: ApiOptions = {}
): Promise<T> => {
  const accessToken = getAccessToken();
  
  const config: RequestInit = {
    method: options.method || "GET",
    credentials: "include", // Still send cookies (for future backend changes)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Add Authorization header if token exists
  if (accessToken) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    console.log('[API CLIENT] Authorization header added', { endpoint, tokenLength: accessToken.length });
  } else {
    console.warn('[API CLIENT] No access token found for request', { endpoint });
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
      // Don't attempt token refresh for certain auth endpoints
      if (
        endpoint.includes("/auth/verify-email/confirm") ||
        endpoint.includes("/auth/reset-password")
      ) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || response.statusText };
        }
        const errorMessage =
          errorData.message || errorData.error || "An error occurred during the API request.";
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).data = errorData;
        throw error;
      }

      // If already refreshing, queue this request
      if (isRefreshing && refreshPromise) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
              // Retry the original request with new token
              const newToken = getAccessToken();
              if (newToken) {
                (config.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
              }
              fetch(`${baseUrl}${endpoint}`, config)
                .then((res) => res.json())
                .then(resolve)
                .catch(reject);
            },
            reject,
          });
        });
      }

      // Start refresh
      isRefreshing = true;
      refreshPromise = ensureValidToken(baseUrl);

      try {
        const refreshSuccess = await refreshPromise;
        if (!refreshSuccess) {
          throw new Error("Failed to refresh token");
        }

        processQueue(true);
        isRefreshing = false;
        refreshPromise = null;

        // Retry with new token
        const newToken = getAccessToken();
        if (newToken) {
          (config.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
        }
        response = await fetch(`${baseUrl}${endpoint}`, config);
      } catch (error) {
        processQueue(false, error as Error);
        clearTokens();
        isRefreshing = false;
        refreshPromise = null;
        resetRefreshState();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
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
        errorData.message || errorData.error || "An error occurred during the API request.";

      // Handle specific error types with user-friendly messages
      if (
        errorMessage.includes("Transaction already closed") ||
        errorMessage.includes("transaction timeout")
      ) {
        errorMessage =
          "The request took too long to process. Please try again. If the problem persists, the server may be experiencing high load.";
      } else if (errorMessage.includes("Database error")) {
        errorMessage = "A database error occurred. Please try again in a moment.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
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
export * from "./notifications";
export * from "./learning-resources";
export * from "./users";
export * from "./talent";
