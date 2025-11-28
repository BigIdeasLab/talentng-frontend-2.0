import type { Notification } from "@/lib/types/notification";

export interface GetNotificationsParams {
  userId: string;
  read?: boolean;
  type?: string;
}

// Re-export the Notification type
export type { Notification };
