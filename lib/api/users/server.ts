/**
 * Server-side Users API Client
 * Used only in Next.js Server Components and Server Actions
 */

import serverApiClient from "@/lib/api/server-client";
import type { User } from "@/lib/types/auth";

/**
 * Get current authenticated user details (Server-side)
 * GET /users/me
 */
export async function getServerCurrentUser(): Promise<User> {
  return serverApiClient<User>("/users/me");
}
