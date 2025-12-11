"use client";

import { useState, useCallback } from "react";
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  postOpportunity,
  deleteOpportunity,
  type Opportunity,
  type GetOpportunitiesParams,
  type PaginatedOpportunitiesResponse,
} from "@/lib/api/opportunities";

interface UseOpportunitiesManagerReturn {
  isLoading: boolean;
  error: string | null;
  getAll: (params?: GetOpportunitiesParams) => Promise<PaginatedOpportunitiesResponse>;
  getById: (id: string) => Promise<Opportunity>;
  create: (data: Partial<Opportunity>) => Promise<Opportunity>;
  update: (id: string, data: Partial<Opportunity>) => Promise<Opportunity>;
  post: (id: string) => Promise<Opportunity>;
  delete: (id: string) => Promise<void>;
  updateStatus: (id: string, status: "active" | "closed" | "draft") => Promise<Opportunity>;
}

export function useOpportunitiesManager(): UseOpportunitiesManagerReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(
    async (params?: GetOpportunitiesParams): Promise<PaginatedOpportunitiesResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getOpportunities(params);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch opportunities";
        setError(errorMsg);
        console.error("Failed to fetch opportunities:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getById = useCallback(
    async (id: string): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getOpportunityById(id);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch opportunity";
        setError(errorMsg);
        console.error("Failed to fetch opportunity:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const create = useCallback(
    async (data: Partial<Opportunity>): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await createOpportunity(data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to create opportunity";
        setError(errorMsg);
        console.error("Failed to create opportunity:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (id: string, data: Partial<Opportunity>): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await updateOpportunity(id, data);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update opportunity";
        setError(errorMsg);
        console.error("Failed to update opportunity:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const post = useCallback(
    async (id: string): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await postOpportunity(id);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to post opportunity";
        setError(errorMsg);
        console.error("Failed to post opportunity:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteOpp = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        return await deleteOpportunity(id);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to delete opportunity";
        setError(errorMsg);
        console.error("Failed to delete opportunity:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (
      id: string,
      status: "active" | "closed" | "draft"
    ): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await updateOpportunity(id, { status });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update opportunity status";
        setError(errorMsg);
        console.error("Failed to update opportunity status:", err);
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
    create,
    update,
    post,
    delete: deleteOpp,
    updateStatus,
  };
}
