/**
 * Centralized Talent API Hooks
 * Single point of access for all talent-related React Query hooks
 *
 * These hooks wrap the talent API layer with React Query for
 * caching, invalidation, and state management
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getCurrentProfile,
  getTalentProfileByUserId,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  getDashboardStats,
  listTalentProfiles,
  getMyServices,
  createService,
  updateService,
  deleteService,
  getTalentServices,
  searchServicesByTags,
  addServiceReview,
  uploadGalleryImages,
  deleteGalleryItem,
  getTalentRecommendations,
  createRecommendation,
  getRecommendationStats,
  deleteRecommendation,
  type TalentProfile,
  type DashboardStats,
  type Service,
  type CreateServiceInput,
  type UpdateServiceInput,
  type TalentRecommendationDto,
  type CreateRecommendationDto,
  type TalentFilterParams,
} from "@/lib/api/talent";

/**
 * Profile Hooks
 */
export function useCurrentProfile() {
  return useQuery({
    queryKey: ["current-profile"],
    queryFn: getCurrentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTalentProfile(userId: string) {
  return useQuery({
    queryKey: ["talent-profile", userId],
    queryFn: () => getTalentProfileByUserId(userId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}

export function useUpdateProfileImage() {
  return useMutation({
    mutationFn: updateProfileImage,
  });
}

export function useUpdateCoverImage() {
  return useMutation({
    mutationFn: updateCoverImage,
  });
}

/**
 * Discovery Hooks
 */
export function useListTalentProfiles(filters?: TalentFilterParams) {
  return useQuery({
    queryKey: ["talent-profiles", filters],
    queryFn: () => listTalentProfiles(filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Services Hooks
 */
export function useMyServices() {
  return useQuery({
    queryKey: ["my-services"],
    queryFn: getMyServices,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: createService,
  });
}

export function useUpdateService() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) =>
      updateService(id, data),
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: deleteService,
  });
}

export function useTalentServices(talentId: string) {
  return useQuery({
    queryKey: ["talent-services", talentId],
    queryFn: () => getTalentServices(talentId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchServicesByTags(tags: string[]) {
  return useQuery({
    queryKey: ["search-services", tags],
    queryFn: () => searchServicesByTags(tags),
    staleTime: 5 * 60 * 1000,
    enabled: tags.length > 0,
  });
}

export function useAddServiceReview() {
  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: any }) =>
      addServiceReview(serviceId, data),
  });
}

/**
 * Gallery Hooks
 */
export function useUploadGalleryImages() {
  return useMutation({
    mutationFn: (files: File[]) => uploadGalleryImages(files),
  });
}

export function useDeleteGalleryItem() {
  return useMutation({
    mutationFn: deleteGalleryItem,
  });
}

/**
 * Recommendations Hooks
 */
export function useTalentRecommendations() {
  return useQuery({
    queryKey: ["talent-recommendations"],
    queryFn: getTalentRecommendations,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRecommendation() {
  return useMutation({
    mutationFn: ({
      talentUserId,
      data,
    }: {
      talentUserId: string;
      data: CreateRecommendationDto;
    }) => createRecommendation(talentUserId, data),
  });
}

export function useGetRecommendationStats(talentUserId: string) {
  return useQuery({
    queryKey: ["recommendation-stats", talentUserId],
    queryFn: () => getRecommendationStats(talentUserId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteRecommendation() {
  return useMutation({
    mutationFn: deleteRecommendation,
  });
}
