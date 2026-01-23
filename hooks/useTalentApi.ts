/**
 * Centralized Talent API Hook
 * Single point of access for all talent API operations
 *
 * Consolidates all talent API calls from scattered components
 * Provides consistent error handling and loading states
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import {
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

/**
 * Profile Hooks
 */
export function useCurrentProfile() {
  return useQuery({
    queryKey: ["current-profile"],
    queryFn: talentProfileApi.getCurrentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTalentProfile(userId: string) {
  return useQuery({
    queryKey: ["talent-profile", userId],
    queryFn: () => talentProfileApi.getTalentProfileByUserId(userId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: talentProfileApi.getDashboardStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: talentProfileApi.updateProfile,
  });
}

export function useUpdateProfileImage() {
  return useMutation({
    mutationFn: talentProfileApi.updateProfileImage,
  });
}

export function useUpdateCoverImage() {
  return useMutation({
    mutationFn: talentProfileApi.updateCoverImage,
  });
}

/**
 * Discovery Hooks
 */
export function useListTalentProfiles(filters?: TalentFilterParams) {
  return useQuery({
    queryKey: ["talent-profiles", filters],
    queryFn: () => talentDiscoveryApi.listTalentProfiles(filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Services Hooks
 */
export function useMyServices() {
  return useQuery({
    queryKey: ["my-services"],
    queryFn: talentServicesApi.getMyServices,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: talentServicesApi.createService,
  });
}

export function useUpdateService() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) =>
      talentServicesApi.updateService(id, data),
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: talentServicesApi.deleteService,
  });
}

export function useTalentServices(talentId: string) {
  return useQuery({
    queryKey: ["talent-services", talentId],
    queryFn: () => talentServicesApi.getTalentServices(talentId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchServicesByTags(tags: string[]) {
  return useQuery({
    queryKey: ["search-services", tags],
    queryFn: () => talentServicesApi.searchServicesByTags(tags),
    staleTime: 5 * 60 * 1000,
    enabled: tags.length > 0,
  });
}

export function useAddServiceReview() {
  return useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: string; data: any }) =>
      talentServicesApi.addServiceReview(serviceId, data),
  });
}

/**
 * Gallery Hooks
 */
export function useUploadGalleryImages() {
  return useMutation({
    mutationFn: (files: File[]) => talentGalleryApi.uploadGalleryImages(files),
  });
}

export function useDeleteGalleryItem() {
  return useMutation({
    mutationFn: talentGalleryApi.deleteGalleryItem,
  });
}

/**
 * Recommendations Hooks
 */
export function useTalentRecommendations() {
  return useQuery({
    queryKey: ["talent-recommendations"],
    queryFn: talentRecommendationsApi.getTalentRecommendations,
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
    }) => talentRecommendationsApi.createRecommendation(talentUserId, data),
  });
}

export function useGetRecommendationStats(talentUserId: string) {
  return useQuery({
    queryKey: ["recommendation-stats", talentUserId],
    queryFn: () =>
      talentRecommendationsApi.getRecommendationStats(talentUserId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteRecommendation() {
  return useMutation({
    mutationFn: talentRecommendationsApi.deleteRecommendation,
  });
}
