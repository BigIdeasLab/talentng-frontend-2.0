// Support Ticket Types

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "account" | "payment" | "technical" | "other";

export interface CreateTicketDto {
  subject: string;
  message: string;
  category: TicketCategory;
}

export interface TicketFilters {
  status?: TicketStatus;
  limit?: number;
  offset?: number;
}

export interface TicketListItem {
  id: string;
  ticketId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  replyCount: number;
  lastReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketListResponse {
  data: TicketListItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ConversationMessage {
  id: string;
  message: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
  isAdmin: boolean;
  createdAt: string;
}

export interface TicketDetail {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: {
    id: string;
    username: string;
    email: string;
  } | null;
  conversation: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketResponse {
  id: string;
  ticketId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

export interface AddReplyResponse {
  id: string;
  message: string;
  createdAt: string;
}

export interface TicketCountResponse {
  count: number;
}
