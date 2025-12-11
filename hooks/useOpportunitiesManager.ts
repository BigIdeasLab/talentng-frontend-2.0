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

  const handleError = useCallback((err: unknown, context: string) => {
    const message = err instanceof Error ? err.message : "An error occurred";
    const errorMsg = `${context}: ${message}`;
    setError(errorMsg);
    console.error(errorMsg);
    throw err;
  }, []);

  const getAll = useCallback(
    async (params?: GetOpportunitiesParams): Promise<PaginatedOpportunitiesResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getOpportunities(params);
      } catch (err) {
        handleError(err, "Failed to fetch opportunities");
        return { 
          data: [], 
          pagination: {
            total: 0,
            limit: 20,
            offset: 0,
            currentPage: 1,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        };
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const getById = useCallback(
    async (id: string): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await getOpportunityById(id);
      } catch (err) {
        handleError(err, "Failed to fetch opportunity");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const create = useCallback(
    async (data: Partial<Opportunity>): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await createOpportunity(data);
      } catch (err) {
        handleError(err, "Failed to create opportunity");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const update = useCallback(
    async (id: string, data: Partial<Opportunity>): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await updateOpportunity(id, data);
      } catch (err) {
        handleError(err, "Failed to update opportunity");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const post = useCallback(
    async (id: string): Promise<Opportunity> => {
      setIsLoading(true);
      setError(null);
      try {
        return await postOpportunity(id);
      } catch (err) {
        handleError(err, "Failed to post opportunity");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  const deleteOpp = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        return await deleteOpportunity(id);
      } catch (err) {
        handleError(err, "Failed to delete opportunity");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
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
        handleError(err, "Failed to update opportunity status");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
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
