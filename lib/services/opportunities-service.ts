/**
 * Opportunities Service Layer
 * Exports pure API functions (no React hooks)
 * Used by hooks, server actions, or non-React code
 */

export {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  postOpportunity,
  deleteOpportunity,
  saveOpportunity,
  unsaveOpportunity,
  getSaveStatus,
  getSavedOpportunities,
  type Opportunity,
  type GetOpportunitiesParams,
  type PaginatedOpportunitiesResponse,
} from "@/lib/api/opportunities";
