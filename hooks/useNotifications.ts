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

export function useNotifications(
  recipientRole?: "talent" | "recruiter" | "general",
) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [forceRefreshTrigger, setForceRefreshTrigger] = useState(0);

  /**
   * Fetch all notifications for the current user, optionally filtered by recipient role
   */
  const fetchNotifications = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await getNotifications({
          userId: user.id,
          recipientRole,
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
  }, [user, recipientRole]);

  /**
   * Fetch unread notifications only, optionally filtered by recipient role
   */
  const fetchUnreadNotifications = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await getNotifications({
          userId: user.id,
          read: false,
          recipientRole,
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
  }, [user, recipientRole]);

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
   * Trigger a refresh of notifications (used by real-time socket)
   */
  const refreshNotifications = useCallback(() => {
    setForceRefreshTrigger((prev) => prev + 1);
  }, []);

  /**
   * Initial fetch on component mount and when refresh is triggered
   */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, forceRefreshTrigger]);

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
    refreshNotifications,
  };
}
