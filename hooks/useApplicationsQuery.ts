/**
 * Simple React Query hook for applications
 * Replaces useApplications with cleaner, more testable approach
 * Uses TanStack React Query for state management
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getApplications,
  getApplicationById,
  submitApplication,
  updateApplicationStatus,
  type Application,
} from "@/lib/services/applications-service";

/**
 * Fetch all applications for an opportunity
 */
export function useApplicationsQuery(opportunityId: string) {
  return useQuery({
    queryKey: ["applications", opportunityId],
    queryFn: () => getApplications({ opportunityId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!opportunityId,
  });
}

/**
 * Fetch a single application by ID
 */
export function useApplicationQuery(id: string) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

/**
 * Submit a new application
 */
export function useSubmitApplication() {
  return useMutation({
    mutationFn: (data: {
      opportunityId: string;
      profileType: "talent" | "mentor";
      note?: string;
      files?: File[];
    }) => submitApplication(data),
  });
}

/**
 * Update application status
 */
export function useUpdateApplicationStatus() {
  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => updateApplicationStatus(applicationId, status),
  });
}

/**
 * Legacy hook for backward compatibility
 * Provides the old useApplications interface
 * (Deprecated - use individual hooks above instead)
 */
export function useApplications() {
  const submitMutation = useSubmitApplication();
  const statusMutation = useUpdateApplicationStatus();

  return {
    isLoading: submitMutation.isPending || statusMutation.isPending,
    error: submitMutation.error || statusMutation.error || null,
    getAll: (opportunityId: string) => getApplications({ opportunityId }),
    getById: (id: string) => getApplicationById(id),
    submit: (data: { opportunityId: string; profileType: "talent" | "mentor"; note?: string; files?: File[] }) =>
      submitMutation.mutateAsync(data),
    updateStatus: (applicationId: string, status: string) =>
      statusMutation.mutateAsync({ applicationId, status }),
  };
}
