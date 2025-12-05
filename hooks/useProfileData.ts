"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  talentProfileApi,
  talentRecommendationsApi,
  talentServicesApi,
} from "@/lib/api/talent-service";
import { mapAPIToUI } from "@/lib/profileMapper";
import type { TalentProfile } from "@/lib/api/talent-service";
import type { UIProfileData } from "@/lib/profileMapper";

// Query keys for consistency
export const profileQueryKeys = {
  all: ["profile"] as const,
  current: () => [...profileQueryKeys.all, "current"] as const,
  stats: () => [...profileQueryKeys.all, "stats"] as const,
  recommendations: () => [...profileQueryKeys.all, "recommendations"] as const,
  services: () => [...profileQueryKeys.all, "services"] as const,
};

/**
 * Hook for fetching current user's talent profile
 * Caches for 5 minutes by default
 */
export function useCurrentProfile() {
  return useQuery({
    queryKey: profileQueryKeys.current(),
    queryFn: talentProfileApi.getCurrentProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: profileQueryKeys.stats(),
    queryFn: talentProfileApi.getDashboardStats,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching talent recommendations
 */
export function useTalentRecommendations() {
  return useQuery({
    queryKey: profileQueryKeys.recommendations(),
    queryFn: talentRecommendationsApi.getTalentRecommendations,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching my services
 */
export function useMyServices() {
  return useQuery({
    queryKey: profileQueryKeys.services(),
    queryFn: talentServicesApi.getMyServices,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Combined hook for fetching all profile-related data at once
 * Returns profile data mapped to UI format with stats, recommendations, and services
 */
export function useProfileData() {
  const profile = useCurrentProfile();
  const stats = useDashboardStats();
  const recommendations = useTalentRecommendations();
  const services = useMyServices();

  const isLoading = profile.isLoading || stats.isLoading || recommendations.isLoading || services.isLoading;
  const isError = profile.isError || stats.isError || recommendations.isError || services.isError;
  const error = profile.error || stats.error || recommendations.error || services.error;

  const mappedProfileData = profile.data ? mapAPIToUI(profile.data) : null;

  return {
    profile: mappedProfileData,
    profileRaw: profile.data,
    stats: stats.data,
    recommendations: recommendations.data,
    services: services.data,
    isLoading,
    isError,
    error: error instanceof Error ? error.message : String(error),
  };
}

/**
 * Hook for updating profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: talentProfileApi.updateProfile,
    onSuccess: (updatedProfile) => {
      // Invalidate and refetch profile query
      queryClient.setQueryData(profileQueryKeys.current(), updatedProfile);
    },
  });
}

/**
 * Hook for updating profile image
 */
export function useUpdateProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: talentProfileApi.updateProfileImage,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileQueryKeys.current(), updatedProfile);
    },
  });
}

/**
 * Hook for updating cover image
 */
export function useUpdateCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: talentProfileApi.updateCoverImage,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileQueryKeys.current(), updatedProfile);
    },
  });
}
