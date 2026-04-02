import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/lib/api/support";
import type { CreateTicketDto, TicketFilters } from "@/lib/api/support/types";

/**
 * Hook to fetch user's support tickets
 */
export const useTickets = (filters?: TicketFilters) => {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => supportService.getMyTickets(filters),
  });
};

/**
 * Hook to fetch a specific ticket by ID
 */
export const useTicket = (ticketId: string | null) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => supportService.getTicketById(ticketId!),
    enabled: !!ticketId,
  });
};

/**
 * Hook to create a new support ticket
 */
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketDto) => supportService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketCount"] });
    },
  });
};

/**
 * Hook to add a reply to a ticket
 */
export const useAddReply = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => supportService.addReply(ticketId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticketCount"] });
    },
  });
};

/**
 * Hook to fetch active ticket count (open + in_progress)
 */
export const useTicketCount = () => {
  return useQuery({
    queryKey: ["ticketCount"],
    queryFn: () => supportService.getTicketCount(),
  });
};
