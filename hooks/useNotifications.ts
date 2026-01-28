"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
} from "@/lib/api";
import type { Notification } from "@/lib/types/notification";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  /**
   * Fetch all notifications for the current user
   */
  const fetchNotifications = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await getNotifications({
          userId: user.id,
        });
        setNotifications(fetchedNotifications);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch notifications.";
        setError(errorMessage);
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  /**
   * Fetch unread notifications only
   */
  const fetchUnreadNotifications = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await getNotifications({
          userId: user.id,
          read: false,
        });
        setNotifications(fetchedNotifications);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch notifications.";
        setError(errorMessage);
        console.error("Error fetching unread notifications:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  /**
   * Mark a specific notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const updated = await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? updated : n)),
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read.";
      setError(errorMessage);
      console.error("Error marking notification as read:", err);
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          readAt: new Date().toISOString(),
        })),
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read.";
      setError(errorMessage);
      console.error("Error marking all notifications as read:", err);
    }
  }, []);

  /**
   * Get unread notifications count
   */
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  /**
   * Initial fetch on component mount
   */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    fetchUnreadNotifications,
    markAsRead,
    markAllAsRead,
    isNotificationOpen,
    setIsNotificationOpen,
  };
}
