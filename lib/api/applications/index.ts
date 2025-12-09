/**
 * Applications API Client
 * Handles all application-related API calls
 */

import apiClient from "@/lib/api";
import type { Application, ApplicationSubmission, ApplicationResponse } from "./types";

/**
 * Submit an application with optional note and attachments
 * Handles FormData for file uploads
 */
export const submitApplication = async (
  submission: ApplicationSubmission & { files?: File[] }
): Promise<ApplicationResponse> => {
  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append("opportunityId", submission.opportunityId);
  
  if (submission.note) {
    formData.append("note", submission.note);
  }

  // Add files if provided
  if (submission.files && submission.files.length > 0) {
    submission.files.forEach((file) => {
      formData.append("attachments", file, file.name);
    });
  }

  return apiClient<ApplicationResponse>("/applications", {
    method: "POST",
    body: formData,
  });
};

/**
 * Legacy method - submit basic application
 */
export const applyToOpportunity = async (
  application: Application
): Promise<ApplicationResponse> => {
  return apiClient<ApplicationResponse>("/applications", {
    method: "POST",
    body: application,
  });
};

/**
 * Get all applications for current user
 */
export const getApplications = async (): Promise<Application[]> => {
  return apiClient<Application[]>("/applications");
};

/**
 * Get applications with filters
 */
export const getApplicationsWithFilters = async (params: {
  status?: string;
  opportunityId?: string;
  limit?: number;
  offset?: number;
}): Promise<Application[]> => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.opportunityId) query.append("opportunityId", params.opportunityId);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString();
  const endpoint = `/applications${queryString ? `?${queryString}` : ""}`;

  return apiClient<Application[]>(endpoint);
};

/**
 * Delete an application
 */
export const deleteApplication = async (applicationId: string): Promise<void> => {
  return apiClient<void>(`/applications/${applicationId}`, {
    method: "DELETE",
  });
};

// Export types
export type { Application, ApplicationSubmission, ApplicationResponse };
