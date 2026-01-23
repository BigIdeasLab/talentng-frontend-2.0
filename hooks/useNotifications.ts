"use client";

import { useState, useEffect, useCallback } from "react";
import { getNotifications } from "@/lib/api";
import { Notification } from "@/lib/types/notification";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const fetchedNotifications = await getNotifications(user.id);
        setNotifications(fetchedNotifications);
      } catch (err) {
        setError("Failed to fetch notifications.");
      }
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    isNotificationOpen,
    setIsNotificationOpen,
  };
}
