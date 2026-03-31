/**
 * Business Verification React Query Hooks
 * Provides hooks for managing verification state with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitVerification,
  getVerificationStatus,
  resubmitVerification,
  uploadDocument,
  type SubmitVerificationRequest,
  type ResubmitVerificationRequest,
} from "@/lib/api/verification";

const VERIFICATION_QUERY_KEY = ["verification", "status"];
const POLLING_INTERVAL = 30000; // 30 seconds

/**
 * Get verification status with automatic polling for pending status
 */
export function useVerificationStatus(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: VERIFICATION_QUERY_KEY,
    queryFn: getVerificationStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a role mismatch error
      if (error?.isRoleMismatch || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    refetchInterval: (query) => {
      // Poll every 30s if status is pending
      return query.state.data?.status === "pending" ? POLLING_INTERVAL : false;
    },
  });

  return query;
}

/**
 * Submit new verification application
 */
export function useSubmitVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubmitVerificationRequest) =>
      submitVerification(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_QUERY_KEY });
    },
  });
}

/**
 * Resubmit rejected verification
 */
export function useResubmitVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ResubmitVerificationRequest) =>
      resubmitVerification(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_QUERY_KEY });
    },
  });
}

/**
 * Upload verification document
 */
export function useUploadDocument() {
  return useMutation({
    mutationFn: (file: File) => uploadDocument(file),
  });
}
