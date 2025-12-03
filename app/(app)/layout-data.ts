/**
 * Server-side data fetching for app layout
 * Fetches profile data once at layout level to avoid redundant requests
 * Data is passed to ProfileProvider and available to all app pages
 */

import { getServerCurrentProfile, getServerDashboardStats, getServerTalentRecommendations } from "@/lib/api/talent/server";
import { mapAPIToUI } from "@/lib/profileMapper";
import { getCurrentUser } from "@/lib/api/users";

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

export async function getBusinessLayoutData() {
  try {
    const [profileRes, userRes] = await Promise.all([
      getServerCurrentProfile(),
      getCurrentUser(),
    ]);
    
    const mappedUIData = mapAPIToUI(profileRes);
    
    const [statsRes, recommendationsRes] = await Promise.all([
      getServerDashboardStats(),
      getServerTalentRecommendations(profileRes.userId),
    ]);

    return {
      profileData: mappedUIData,
      profileRaw: profileRes,
      userId: profileRes.userId,
      userRoles: userRes.roles || ["talent"],
      stats: statsRes,
      recommendations: recommendationsRes.map(mapRecommendationToUI),
      error: null,
    };
  } catch (error) {
    console.error("Error loading app layout data on server:", error);
    return {
      profileData: null,
      profileRaw: null,
      userId: null,
      userRoles: ["talent"],
      stats: null,
      recommendations: [],
      error: error instanceof Error ? error.message : "Failed to load profile data",
    };
  }
}
