/**
 * React Query hook for mentor dashboard data
 * Uses TanStack React Query for state management
 */

import { useQuery } from "@tanstack/react-query";
import {
  getMentorDashboardFull,
  type MentorDashboardResponse,
} from "@/lib/api/mentorship";

/**
 * Fetch mentor dashboard data
 */
export function useMentorDashboard() {
  return useQuery<MentorDashboardResponse>({
    queryKey: ["mentor-dashboard"],
    queryFn: getMentorDashboardFull,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
