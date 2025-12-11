"use client";

import { useState, useCallback } from "react";
import {
  getApplications,
  getApplicationById,
  submitApplication,
  updateApplicationStatus,
  type Application,
} from "@/lib/api/applications";

interface UseApplicationsReturn {
  isLoading: boolean;
  error: string | null;
  getAll: (opportunityId: string) => Promise<Application[]>;
  getById: (id: string) => Promise<Application>;
  submit: (data: {
    opportunityId: string;
    note?: string;
    files?: File[];
  }) => Promise<Application>;
  updateStatus: (applicationId: string, status: string) => Promise<Application>;
}

export function useApplications(): UseApplicationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(
    async (opportunityId: string): Promise<Application[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getApplications({ opportunityId });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch applications";
        setError(errorMsg);
        console.error("Failed to fetch applications:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getById = useCallback(
    async (id: string): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getApplicationById(id);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to fetch application";
        setError(errorMsg);
        console.error("Failed to fetch application:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const submit = useCallback(
    async (data: {
      opportunityId: string;
      note?: string;
      files?: File[];
    }): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        return await submitApplication(data);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to submit application";
        setError(errorMsg);
        console.error("Failed to submit application:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (applicationId: string, status: string): Promise<Application> => {
      setIsLoading(true);
      setError(null);
      try {
        return await updateApplicationStatus(applicationId, status);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to update application";
        setError(errorMsg);
        console.error("Failed to update application:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    getAll,
    getById,
    submit,
    updateStatus,
  };
}
