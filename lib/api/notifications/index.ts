/**
 * Notifications API Client
 * Handles all notification-related API calls
 * Base URL: /api/notifications
 */

import apiClient from "@/lib/api";
import type {
  Notification,
  CreateNotificationPayload,
  UpdateNotificationPayload,
  GetNotificationsFilters,
} from "@/lib/types/notification";

/**
 * Create a new notification (Admin Only)
 * POST /api/notifications
 */
export const createNotification = async (
  payload: CreateNotificationPayload,
): Promise<Notification> => {
  return apiClient<Notification>("/notifications", {
    method: "POST",
    body: payload,
  });
};

/**
 * Get notifications with optional filters
 * GET /api/notifications
 * Access Control:
 * - Admins can query any userId
 * - Regular users can only query their own notifications
 * - If no userId specified for non-admin users, defaults to current user's ID
 */
export const getNotifications = async (
  filters?: GetNotificationsFilters,
): Promise<Notification[]> => {
  const query = new URLSearchParams();
  if (filters?.userId) {
    query.append("userId", filters.userId);
  }
  if (filters?.type) {
    query.append("type", filters.type);
  }
  if (filters?.deliveryStatus) {
    query.append("deliveryStatus", filters.deliveryStatus);
  }
  if (filters?.read !== undefined) {
    query.append("read", String(filters.read));
  }

  const endpoint = `/notifications${query.toString() ? `?${query.toString()}` : ""}`;
  return apiClient<Notification[]>(endpoint);
};

/**
 * Get a specific notification by ID
 * GET /api/notifications/:id
 */
export const getNotificationById = async (
  notificationId: string,
): Promise<Notification> => {
  return apiClient<Notification>(`/notifications/${notificationId}`);
};

/**
 * Update a notification
 * PATCH /api/notifications/:id
 * Regular users can only update: readAt, isRead
 * Admins can update: readAt, deliveryStatus, isRead
 */
export const updateNotification = async (
  notificationId: string,
  payload: UpdateNotificationPayload,
): Promise<Notification> => {
  return apiClient<Notification>(`/notifications/${notificationId}`, {
    method: "PATCH",
    body: payload,
  });
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id
 * Convenience method that calls updateNotification with isRead: true
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  return updateNotification(notificationId, { isRead: true });
};

/**
 * Mark all notifications as read for the current user
 * Fetches all unread notifications and marks them as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  const notifications = await getNotifications({ read: false });
  const promises = notifications.map((notification) =>
    markNotificationAsRead(notification.id),
  );
  await Promise.all(promises);
};

/**
 * Delete a notification (Admin Only)
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (
  notificationId: string,
): Promise<Notification> => {
  return apiClient<Notification>(`/notifications/${notificationId}`, {
    method: "DELETE",
  });
};

/**
 * Get unread notifications count for current user
 */
export const getUnreadNotificationsCount = async (): Promise<number> => {
  const notifications = await getNotifications({ read: false });
  return notifications.length;
};

/**
 * Get notifications by type
 */
export const getNotificationsByType = async (
  type: string,
): Promise<Notification[]> => {
  return getNotifications({ type: type as any });
};

/**
 * Get failed delivery notifications (Admin only)
 */
export const getFailedNotifications = async (): Promise<Notification[]> => {
  return getNotifications({ deliveryStatus: "failed" });
};

// Export types
export type {
  Notification,
  CreateNotificationPayload,
  UpdateNotificationPayload,
  GetNotificationsFilters,
};
