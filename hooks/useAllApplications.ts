"use client";

import { useState, useEffect, useRef } from "react";
import { mapApplicationsToUI, type MappedApplicant } from "@/lib/mappers/application";
import apiClient, { type Application } from "@/lib/api";

export function useAllApplications() {
  const [applicants, setApplicants] = useState<MappedApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Prevent duplicate calls in Strict Mode
    let isCancelled = false;

    const fetchApplicants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiClient<Application[]>("/applications");
        
        if (!isCancelled && isMountedRef.current) {
          const mapped = mapApplicationsToUI(data);
          setApplicants(mapped);
        }
      } catch (err) {
        if (!isCancelled && isMountedRef.current) {
          const message = err instanceof Error ? err.message : "Failed to load applicants";
          setError(message);
          console.error("Error fetching applicants:", err);
          setApplicants([]);
        }
      } finally {
        if (!isCancelled && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchApplicants();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient<Application[]>("/applications");
      const mapped = mapApplicationsToUI(data);
      setApplicants(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load applicants";
      setError(message);
      console.error("Error fetching applicants:", err);
      setApplicants([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { applicants, isLoading, error, refetch };
}
