/**
 * Server-side data fetching for profile page
 * This runs on the server and passes data to client components
 *
 * DEPRECATED: Consider moving to useProfileData() hook on client-side.
 * This server fetch is kept for initial page load performance only.
 * All refetches should use the React Query hooks from useProfileData.
 */

import {
  getServerCurrentProfile,
  getServerDashboardStats,
  getServerTalentRecommendations,
  getServerMyServices,
} from "@/lib/api/talent/server";
import { mapAPIToUI } from "@/lib/profileMapper";

const mapRecommendationToUI = (apiRec: any) => ({
  id: apiRec.id,
  name: apiRec.recommendedBy.username || apiRec.recommendedBy.email,
  date: new Date(apiRec.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  avatar: "",
  text: apiRec.comment || `Recommended for: ${apiRec.title}`,
});

export async function getProfilePageData() {
  try {
    const profileRes = await getServerCurrentProfile();

    const mappedUIData = mapAPIToUI(profileRes);

    const [statsRes, recommendationsRes, servicesRes] = await Promise.all([
      getServerDashboardStats(),
      getServerTalentRecommendations(profileRes.userId),
      getServerMyServices(),
    ]);

    return {
      profileData: mappedUIData,
      userId: profileRes.userId,
      stats: statsRes,
      recommendations: recommendationsRes.map(mapRecommendationToUI),
      services: servicesRes || [],
      error: null,
    };
  } catch (error) {
    console.error("Error loading profile data on server:", error);
    return {
      profileData: null,
      userId: null,
      stats: null,
      recommendations: [],
      services: [],
      error:
        error instanceof Error ? error.message : "Failed to load profile data",
    };
  }
}
