/**
 * Talent API Service Layer
 * Exports pure API functions (no React hooks)
 * Used by hooks, server actions, or non-React code
 */

export {
  talentProfileApi,
  talentDiscoveryApi,
  talentServicesApi,
  talentGalleryApi,
  talentRecommendationsApi,
  type TalentProfile,
  type DashboardStats,
  type Service,
  type CreateServiceInput,
  type UpdateServiceInput,
  type TalentRecommendationDto,
  type CreateRecommendationDto,
  type TalentFilterParams,
} from "@/lib/api/talent-service";
