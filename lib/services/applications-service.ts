/**
 * Applications Service Layer
 * Exports pure API functions (no React hooks)
 * Used by hooks, server actions, or non-React code
 */

export {
  getApplications,
  getApplicationById,
  submitApplication,
  updateApplicationStatus,
  type Application,
} from "@/lib/api/applications";
