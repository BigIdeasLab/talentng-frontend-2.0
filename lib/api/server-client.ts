/**
 * Server-side API Client
 * Used only in server components for secure API calls
 * Token comes from cookies via Next.js
 * Handles token refresh on 401 responses
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
    // Return null/empty for unauthenticated requests instead of throwing
    // This allows unauthenticated pages (like login, signup) to render without errors
    // and allows ProfileProvider to gracefully handle missing profiles
    return null as T;
  }

  // Build Cookie header from all cookies so browser can manage them
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Cookie: cookieHeader,
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

    let response = await fetch(url, config);

    // If token expired, attempt to refresh
    if (response.status === 401) {
      try {
        const newCookieStore = await cookies();
        const newCookieHeader = newCookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        
        const refreshUrl = `${baseUrl}/auth/refresh`;
        
        const refreshResponse = await fetch(refreshUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: newCookieHeader,
          },
          body: JSON.stringify({}),
        });

        if (refreshResponse.ok) {
          // The Set-Cookie headers have been sent by the response
          // The browser will apply them automatically
          // For this request, we can't access the new cookies (Server Component limitation)
          // But on the next request, the new cookies will be available
          
          // Return null for now - next render will use the refreshed cookies
          return null as T;
        }
      } catch (refreshError) {
        // Token refresh failed, continue with original error
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

      let errorMessage =
        errorData.message || errorData.error || `API Error: ${response.statusText}`;

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : ({} as T);
    return data;
  } catch (error) {
    throw error;
  }
};

export default serverApiClient;
