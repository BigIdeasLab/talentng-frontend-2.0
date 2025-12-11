import { useState, useEffect } from "react";
import { getOpportunities, type Opportunity, type GetOpportunitiesParams } from "@/lib/api/opportunities";

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useOpportunities(
  params?: GetOpportunitiesParams
): UseOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const response = await getOpportunities(params);
      setOpportunities(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch opportunities");
      setError(error);
      setIsError(true);
      setOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [JSON.stringify(params)]);

  return {
    opportunities,
    isLoading,
    isError,
    error,
    refetch: fetchOpportunities,
  };
}
