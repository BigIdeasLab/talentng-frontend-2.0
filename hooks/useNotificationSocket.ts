"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { getAccessToken } from "@/lib/auth";

// Type guard for EventSource availability
const isEventSourceAvailable = (): boolean => {
  return typeof window !== "undefined" && "EventSource" in window;
};

interface NotificationStreamEvent {
  type: string;
  data: {
    event:
      | "count_updated"
      | "notification_created"
      | "notification_read"
      | "upcoming_updated"
      | "recruiter_interviews_updated"
      | "recruiter_applicants_updated"
      | "mentor_sessions_updated";
    count?: number;
    unread?: number;
    notificationId?: string;
    recipientRole?: "talent" | "recruiter" | "mentor" | "general";
  };
}

interface UseNotificationSocketProps {
  recipientRole?: "talent" | "recruiter" | "mentor" | "general";
  onCountUpdate?: (unread: number, total: number) => void;
  onNotificationCreated?: (notificationId: string) => void;
  onNotificationRead?: (notificationId: string) => void;
  onUpcomingUpdate?: (count: number) => void;
  onRecruiterUpdate?: (count: number) => void;
  onRecruiterApplicantsUpdate?: (count: number) => void;
  onMentorUpdate?: (count: number) => void;
  enabled?: boolean;
}

/**
 * Hook to subscribe to real-time notification updates via SSE (Server-Sent Events)
 *
 * Usage:
 * ```tsx
 * useNotificationSocket({
 *   recipientRole: 'talent',
 *   onCountUpdate: (unread, total) => setNotificationCount(unread),
 *   onNotificationCreated: (id) => refreshNotifications(),
 *   enabled: true
 * });
 * ```
 */
export function useNotificationSocket({
  recipientRole = "talent",
  onCountUpdate,
  onNotificationCreated,
  onNotificationRead,
  onUpcomingUpdate,
  onRecruiterUpdate,
  onRecruiterApplicantsUpdate,
  onMentorUpdate,
  enabled = true,
}: UseNotificationSocketProps) {
  const { user, loading } = useAuth();
  const eventSourceRef = useRef<any>(null); // EventSource type
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second

  /**
   * Connect to notification stream
   */
  const connect = useCallback(() => {
    // Only connect if user is authenticated (not loading), enabled, and not already connected
    if (
      !user ||
      loading ||
      !enabled ||
      eventSourceRef.current ||
      !isEventSourceAvailable()
    ) {
      return;
    }

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3001";
      const streamUrl = new URL("/api/v1/notifications/stream", apiUrl);
      streamUrl.searchParams.append("recipientRole", recipientRole);

      // Pass token as query parameter for EventSource authentication
      const token = getAccessToken();
      if (token) {
        streamUrl.searchParams.append("token", token);
      }

      // EventSource automatically sends cookies with requests to same-origin URLs
      eventSourceRef.current = new window.EventSource(streamUrl.toString());

      // Handle incoming messages
      eventSourceRef.current.addEventListener("message", (event: any) => {
        try {
          const data: NotificationStreamEvent = JSON.parse(event.data);

          if (data.type === "notification" && data.data) {
            const { event: eventType, unread, count } = data.data;

            switch (eventType) {
              case "count_updated":
                // Count has been updated - notification created or read
                if (unread !== undefined && count !== undefined) {
                  onCountUpdate?.(unread, count);
                }
                break;

              case "notification_created":
                // New notification created
                if (data.data.notificationId) {
                  onNotificationCreated?.(data.data.notificationId);
                }
                if (unread !== undefined && count !== undefined) {
                  onCountUpdate?.(unread, count);
                }
                break;

              case "notification_read":
                // Notification was marked as read
                if (data.data.notificationId) {
                  onNotificationRead?.(data.data.notificationId);
                }
                if (unread !== undefined && count !== undefined) {
                  onCountUpdate?.(unread, count);
                }
                break;

              case "upcoming_updated":
                if (count !== undefined) {
                  onUpcomingUpdate?.(count);
                }
                break;
              case "recruiter_interviews_updated":
                if (count !== undefined) {
                  onRecruiterUpdate?.(count);
                }
                break;
              case "recruiter_applicants_updated":
                if (count !== undefined) {
                  onRecruiterApplicantsUpdate?.(count);
                }
                break;
              case "mentor_sessions_updated":
                if (count !== undefined) {
                  onMentorUpdate?.(count);
                }
                break;
            }
          }
        } catch (error) {
          console.error("Error parsing notification stream event:", error);
        }
      });

      // Handle connection open
      eventSourceRef.current.addEventListener("open", () => {
        reconnectAttemptsRef.current = 0;
      });

      // Handle connection errors
      eventSourceRef.current.addEventListener("error", (error: any) => {
        // Only log detailed errors in development
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "Notification stream connection failed - this is expected if the notifications API is not available",
          );
        }
        eventSourceRef.current?.close();
        eventSourceRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay =
            baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          reconnectAttemptsRef.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `Notification stream: Stopped trying to connect after ${maxReconnectAttempts} attempts. This is normal if the notifications API is not implemented.`,
            );
          }
        }
      });
    } catch (error) {
      console.error("Error creating notification stream connection:", error);
    }
  }, [
    user,
    loading,
    recipientRole,
    enabled,
    onCountUpdate,
    onNotificationCreated,
    onNotificationRead,
    onUpcomingUpdate,
    onRecruiterUpdate,
    onRecruiterApplicantsUpdate,
    onMentorUpdate,
  ]);

  /**
   * Disconnect from stream
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    reconnectAttemptsRef.current = 0;
  }, []);

  // Connect on mount and when dependencies change
  useEffect(() => {
    // Only connect when user is authenticated and auth is done loading
    if (enabled && user && !loading && isEventSourceAvailable()) {
      // Role-specific connection check - all core roles now support SSE
      const supportedRoles = ["talent", "recruiter", "mentor", "general"];
      if (supportedRoles.includes(recipientRole)) {
        connect();
      }
    }

    return () => {
      disconnect();
    };
  }, [enabled, user, loading, connect, disconnect]);

  // Manual reconnect method
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect]);

  return {
    reconnect,
    disconnect,
    isConnected: !!eventSourceRef.current,
  };
}
