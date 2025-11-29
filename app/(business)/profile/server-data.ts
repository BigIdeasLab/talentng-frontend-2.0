/**
 * Server-side data fetching for profile page
 * This runs on the server and passes data to client components
 */

import { getServerCurrentProfile, getServerDashboardStats, getServerTalentRecommendations, getServerMyServices } from "@/lib/api/talent/server";
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
    
    const [statsRes, recommendationsRes, servicesRes] = await Promise.all([
      getServerDashboardStats(),
      getServerTalentRecommendations(profileRes.userId),
      getServerMyServices(),
    ]);

    return {
      profileData: mapAPIToUI(profileRes),
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
      error: error instanceof Error ? error.message : "Failed to load profile data",
    };
  }
}
