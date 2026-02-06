/**
 * Reusable hook for page-level data fetching
 * Handles loading, error, and data transformation consistently
 *
 * Usage:
 * const { data, isLoading, error } = usePageData({
 *   fetchFn: (role) => fetchProfileByRole(role),
 *   transform: (data) => mapAPIToUI(data),
 *   defaultData: DEFAULT_DATA,
 * });
 */

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";

export interface UsePageDataConfig<T> {
  /** Function that fetches data, optionally receives role */
  fetchFn: (role: string) => Promise<T>;

  /** Optional transformation function to apply to fetched data */
  transform?: (data: T, role: string) => T;

  /** Default data to use if fetch fails or while loading */
  defaultData: T;

  /** Whether to log errors (default: true) */
  debug?: boolean;
}

export interface UsePageDataResult<T> {
  /** The fetched and transformed data */
  data: T;

  /** Loading state */
  isLoading: boolean;

  /** Error message if fetch failed */
  error: string | null;
}

/**
 * Hook for consistent page-level data fetching
 * Manages loading/error states and optional data transformation
 */
export function usePageData<T>(
  config: UsePageDataConfig<T>,
): UsePageDataResult<T> {
  const { activeRole } = useProfile();
  const [data, setData] = useState<T>(config.defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const role = activeRole || "talent";

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await config.fetchFn(role);

        const transformedData = config.transform
          ? config.transform(result, role)
          : result;

        setData(transformedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";

        if (config.debug !== false) {
          console.error("[usePageData] Error fetching data:", err);
        }

        setError(errorMessage);
        setData(config.defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeRole, config.fetchFn, config.transform, config.debug]);

  return {
    data,
    isLoading,
    error,
  };
}
