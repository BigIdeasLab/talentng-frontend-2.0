/**
 * React Query hook for talent dashboard data
 * Uses TanStack React Query for state management
 */

import { useQuery } from "@tanstack/react-query";
import {
  getTalentDashboard,
  type TalentDashboardResponse,
} from "@/lib/api/talent";

/**
 * Fetch talent dashboard data
 */
export function useTalentDashboard() {
  return useQuery<TalentDashboardResponse>({
    queryKey: ["talent-dashboard"],
    queryFn: getTalentDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
