/**
 * Centralized Talent API Hooks
 * Single point of access for all talent-related React Query hooks
 *
 * These hooks wrap the talent API layer with React Query for
 * caching, invalidation, and state management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    queryKey: ["profile", "talent"],
    queryFn: getCurrentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTalentProfile(userId: string) {
  return useQuery({
    queryKey: ["talent-profile", userId],
    queryFn: () => getTalentProfileByUserId(userId),
    staleTime: 30 * 1000, // 30 seconds instead of 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (profile not found)
      if (error?.status === 404) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate current profile and talent profiles
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      // Invalidate current profile and talent profiles
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
  });
}

export function useUpdateCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCoverImage,
    onSuccess: () => {
      // Invalidate current profile and talent profiles
      queryClient.invalidateQueries({ queryKey: ["current-profile"] });
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
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
    staleTime: 30 * 1000, // 30 seconds instead of 5 minutes
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      // Also invalidate talent profiles since they include services
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) =>
      updateService(id, data),
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      // Also invalidate talent profiles since they include services
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ["my-services"] });
      // Also invalidate talent profiles since they include services
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => uploadGalleryImages(files),
    onSuccess: () => {
      // Invalidate talent profiles since they include gallery
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      // Invalidate talent profiles since they include gallery
      queryClient.invalidateQueries({ queryKey: ["talent-profile"] });
    },
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
