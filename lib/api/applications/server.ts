/**
 * Server-side Applications API Client
 * Used only in Next.js Server Components and Server Actions
 */

import serverApiClient from "@/lib/api/server-client";
import type { Application } from "./types";

/**
 * Get user's applications (Server-side)
 * GET /applications
 */
export async function getServerApplications(): Promise<Application[]> {
  return serverApiClient<Application[]>("/applications");
}
