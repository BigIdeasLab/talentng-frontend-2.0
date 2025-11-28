/**
 * Server-side Talent API Client
 * Used only in Next.js Server Components and Server Actions
 * Retrieves auth token from cookies via Next.js
 */

import serverApiClient from "@/lib/api/server-client";
import type { APIProfileData } from "@/lib/profileMapper";
import type { TalentProfile, DashboardStats } from "./types";

/**
 * Get Current User's Talent Profile (Server-side)
 * GET /talent/me
 */
export async function getServerCurrentProfile(): Promise<TalentProfile> {
  return serverApiClient<TalentProfile>("/talent/me");
}

/**
 * Get Dashboard Statistics (Server-side)
 * GET /talent/dashboard
 */
export async function getServerDashboardStats(): Promise<DashboardStats> {
  return serverApiClient<DashboardStats>("/talent/dashboard");
}
