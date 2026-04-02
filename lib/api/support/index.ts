import apiClient from "../index";
import type {
  CreateTicketDto,
  CreateTicketResponse,
  TicketFilters,
  TicketListResponse,
  TicketDetail,
  AddReplyResponse,
  TicketCountResponse,
} from "./types";

/**
 * Support API Service
 * Handles all support ticket operations for users
 */
export const supportService = {
  /**
   * Create a new support ticket
   */
  createTicket: async (
    data: CreateTicketDto,
  ): Promise<CreateTicketResponse> => {
    return await apiClient("/support/tickets", {
      method: "POST",
      body: data,
    });
  },

  /**
   * Get list of user's tickets with optional filters
   */
  getMyTickets: async (
    filters?: TicketFilters,
  ): Promise<TicketListResponse> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `/support/tickets?${queryString}`
      : "/support/tickets";

    return await apiClient(endpoint, {
      method: "GET",
    });
  },

  /**
   * Get detailed information about a specific ticket
   * including the full conversation thread
   */
  getTicketById: async (ticketId: string): Promise<TicketDetail> => {
    return await apiClient(`/support/tickets/${ticketId}`, {
      method: "GET",
    });
  },

  /**
   * Add a reply to an existing ticket
   */
  addReply: async (
    ticketId: string,
    message: string,
  ): Promise<AddReplyResponse> => {
    return await apiClient(`/support/tickets/${ticketId}/reply`, {
      method: "POST",
      body: { message },
    });
  },

  /**
   * Get count of active tickets (open + in_progress)
   * Excludes resolved and closed tickets
   */
  getTicketCount: async (): Promise<TicketCountResponse> => {
    return await apiClient("/support/tickets/count", {
      method: "GET",
    });
  },
};

// Export types for convenience
export type * from "./types";
