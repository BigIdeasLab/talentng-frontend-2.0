/**
 * Applications API Client
 * Handles all application-related API calls
 */

import apiClient from "@/lib/api";
import type { Application } from "./types";

export const applyToOpportunity = async (
  application: Application
): Promise<any> => {
  return apiClient<any>("/applications", {
    method: "POST",
    body: application,
  });
};

export const getApplications = async (): Promise<Application[]> => {
  return apiClient<Application[]>("/applications");
};

// Export types
export type { Application };
