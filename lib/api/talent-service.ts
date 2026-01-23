/**
 * Centralized Talent API Service
 * Single source of truth for all talent API interactions
 *
 * Any changes to talent API calls should be made here
 * This ensures consistent error handling, logging, and debugging
 */

import {
  listTalentProfiles,
  getCurrentProfile,
  getDashboardStats,
  getTalentRecommendations,
  getMyServices,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  uploadGalleryImages,
  deleteGalleryItem,
  createService,
  deleteService,
  updateService,
  getTalentProfileByUserId,
  getTalentServices,
  searchServicesByTags,
  addServiceReview,
  getServiceReviews,
  deleteServiceReview,
  createRecommendation,
  getRecommendationStats,
  deleteRecommendation,
} from "./talent";

export type {
  TalentProfile,
  TalentFilterParams,
  DashboardStats,
  PortfolioItem,
  GalleryItem,
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  AddReviewInput,
  TalentRecommendationDto,
  RecommendationStatsDto,
  CreateRecommendationDto,
} from "./talent";

/**
 * Talent Profile APIs
 */
export const talentProfileApi = {
  getCurrentProfile,
  getTalentProfileByUserId,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  getDashboardStats,
};

/**
 * Talent Search & Discovery
 */
export const talentDiscoveryApi = {
  listTalentProfiles,
};

/**
 * Services APIs
 */
export const talentServicesApi = {
  getMyServices,
  createService,
  updateService,
  deleteService,
  getTalentServices,
  searchServicesByTags,
  addServiceReview,
  getServiceReviews,
  deleteServiceReview,
};

/**
 * Gallery APIs
 */
export const talentGalleryApi = {
  uploadGalleryImages,
  deleteGalleryItem,
};

/**
 * Recommendations APIs
 */
export const talentRecommendationsApi = {
  getTalentRecommendations,
  createRecommendation,
  getRecommendationStats,
  deleteRecommendation,
};

/**
 * Comprehensive export for backward compatibility
 * Use specific APIs above for better organization
 */
export const talentApi = {
  profile: talentProfileApi,
  discovery: talentDiscoveryApi,
  services: talentServicesApi,
  gallery: talentGalleryApi,
  recommendations: talentRecommendationsApi,
};
