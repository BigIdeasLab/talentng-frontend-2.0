/**
 * Centralized API Client
 * Handles request configuration, authentication, and error handling
 */

import { getCookie, setCookie, deleteCookie } from "@/lib/utils";

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "/api/v1";

type ApiOptions = {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  credentials?: RequestCredentials;
};

let isRefreshing = false;
let refreshTokenPromise: Promise<string | null> | null = null;
const failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue.length = 0;
};

const apiClient = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  let token = getCookie("accessToken");

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (token) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
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
    if (options.credentials) {
      config.credentials = options.credentials;
    }
    let response = await fetch(`${baseUrl}${endpoint}`, config);

    if (response.status === 401) {
      if (isRefreshing && refreshTokenPromise) {
        return refreshTokenPromise
          .then((newToken) => {
            if (!newToken) throw new Error("Token refresh failed");
            (config.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
            return fetch(`${baseUrl}${endpoint}`, config);
          })
          .then((res) => res.json());
      }

      isRefreshing = true;
      refreshTokenPromise = new Promise(async (resolve) => {
        try {
          const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });
          if (!refreshResponse.ok) {
            throw new Error("Failed to refresh token");
          }
          const { accessToken: newAccessToken } = await refreshResponse.json();
          setCookie("accessToken", newAccessToken);
          processQueue(null, newAccessToken);
          (config.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;
          response = await fetch(`${baseUrl}${endpoint}`, config);
          resolve(newAccessToken);
        } catch (error) {
           processQueue(error as Error, null);
           deleteCookie("accessToken");
           deleteCookie("user");
           isRefreshing = false;
           refreshTokenPromise = null;
           if (typeof window !== "undefined") {
             window.location.href = "/login";
           }
           resolve(null);
        } finally {
          isRefreshing = false;
          refreshTokenPromise = null;
        }
      });

      return refreshTokenPromise.then(() => response.json());
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
      // Keep other error messages as-is from the backend (400, 401, 404, 429, etc.)

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
export * from "./auth";
export * from "./opportunities";
export * from "./applications";
export * from "./mentors";
export * from "./notifications";
export * from "./learning-resources";
export * from "./users";
export * from "./talent";
