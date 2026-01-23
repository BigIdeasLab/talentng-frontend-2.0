/**
 * Centralized profile fetching logic
 * Single entry point for all profile-related API calls by role
 */

import { getCurrentProfile as getTalentProfile } from "@/lib/api/talent";
import { getCurrentRecruiterProfile } from "@/lib/api/recruiter";
import { getCurrentMentorProfile } from "@/lib/api/mentor";

/**
 * Fetch profile data based on user role
 * Automatically selects the correct API endpoint
 */
export async function fetchProfileByRole(role: string) {
  switch (role) {
    case "recruiter":
      return getCurrentRecruiterProfile();
    case "mentor":
      return getCurrentMentorProfile();
    case "talent":
    default:
      return getTalentProfile();
  }
}
