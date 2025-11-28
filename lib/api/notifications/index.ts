/**
 * Notifications API Client
 * Handles all notification-related API calls
 */

import apiClient from "@/lib/api";
import type { Notification, GetNotificationsParams } from "./types";

export const getNotifications = async (
  userId: string,
  read?: boolean,
  type?: string
): Promise<Notification[]> => {
  const query = new URLSearchParams({ userId });
  if (read !== undefined) {
    query.append("read", String(read));
  }
  if (type) {
    query.append("type", type);
  }
  const endpoint = `/notifications?${query.toString()}`;
  return apiClient<Notification[]>(endpoint);
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const endpoint = `/notifications/${notificationId}`;
  return apiClient<Notification>(endpoint, {
    method: "PATCH",
    body: { isRead: true },
  });
};

// Export types
export type { Notification, GetNotificationsParams };
