/**
 * React Query hook for recruiter dashboard data
 * Uses TanStack React Query for state management
 */

import { useQuery } from "@tanstack/react-query";
import {
  getRecruiterDashboard,
  type RecruiterDashboardResponse,
} from "@/lib/api/recruiter";

/**
 * Fetch recruiter dashboard data
 */
export function useRecruiterDashboard() {
  return useQuery<RecruiterDashboardResponse>({
    queryKey: ["recruiter-dashboard"],
    queryFn: getRecruiterDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
