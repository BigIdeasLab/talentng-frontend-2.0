/**
 * Server-side data fetching for profile page
 * This runs on the server and passes data to client components
 */

import { getServerCurrentProfile, getServerDashboardStats } from "@/lib/api/talent/server";
import { mapAPIToUI } from "@/lib/profileMapper";

export async function getProfilePageData() {
  try {
    const [profileRes, statsRes] = await Promise.all([
      getServerCurrentProfile(),
      getServerDashboardStats(),
    ]);

    return {
      profileData: mapAPIToUI(profileRes),
      stats: statsRes,
      error: null,
    };
  } catch (error) {
    console.error("Error loading profile data on server:", error);
    return {
      profileData: null,
      stats: null,
      error: error instanceof Error ? error.message : "Failed to load profile data",
    };
  }
}
