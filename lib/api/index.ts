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
} from "@/lib/auth";

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
            resolve: () => {
              // Retry original request after refresh completes
              fetch(`${baseUrl}${endpoint}`, config)
                .then((res) => res.json())
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
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Session expired - please log in again");
      }

      isRefreshing = true;
      refreshPromise = fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({}),
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
          clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw new Error("Session expired - please log in again");
        }
      } catch (error) {
        processQueue(false, error as Error);
        isRefreshing = false;
        refreshPromise = null;
        clearTokens();
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
        errorData.message ||
        errorData.error ||
        "An error occurred during the API request.";

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
