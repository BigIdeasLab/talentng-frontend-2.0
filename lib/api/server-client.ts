/**
 * Server-side API Client
 * Used only in server components for secure API calls
 * Token comes from cookies via Next.js
 */

import { cookies } from "next/headers";

const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || 
  (process.env.NODE_ENV === "production"
    ? "https://api.talentng.com"
    : "http://localhost:3001/api/v1");

type ApiOptions = {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
};

const serverApiClient = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  // Get token from cookies - must be awaited in Next.js 15+
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    const error = new Error("Not authenticated - No access token found");
    console.error("[Server API] Authentication required:", error.message);
    throw error;
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };

  if (options.body) {
    if (options.body instanceof FormData) {
      delete (config.headers as Record<string, string>)["Content-Type"];
      config.body = options.body;
    } else {
      config.body = JSON.stringify(options.body);
    }
  }

  try {
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || response.statusText };
      }

      let errorMessage =
        errorData.message || errorData.error || `API Error: ${response.statusText}`;

      console.error(`[Server API Error] ${response.status}: ${errorMessage}`);

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : ({} as T);
    return data;
  } catch (error) {
    console.error("[Server API Client Error]:", error);
    throw error;
  }
};

export default serverApiClient;
