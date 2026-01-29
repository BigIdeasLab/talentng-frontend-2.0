"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import type { InAppNotificationPayload } from "@/lib/types/notification";

interface TalentNotificationsProps {
  onActionClick?: () => void;
}

export function TalentNotifications({ onActionClick }: TalentNotificationsProps) {
  const router = useRouter();
  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const { notifications: talentNotifications, loading, error, markAsRead } = useNotifications("talent");
  const { notifications: generalNotifications } = useNotifications("general");

  // Combine talent and general notifications
  useEffect(() => {
    const combined = [
      ...talentNotifications,
      ...generalNotifications.filter(
        (gn) => !talentNotifications.some((tn) => tn.id === gn.id)
      ),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setAllNotifications(combined);
  }, [talentNotifications, generalNotifications]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-2">
            Failed to load notifications
          </p>
        </div>
      </div>
    );
  }

  if (allNotifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-sm">No notifications yet</p>
          <p className="text-gray-500 text-xs mt-1">
            You'll see notifications here when you have new updates
          </p>
        </div>
      </div>
    );
  }

  /**
   * Get background and text colors based on notification type
   */
  const getTypeColors = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100",
          badge: "bg-green-500",
          text: "text-green-700",
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          badge: "bg-yellow-500",
          text: "text-yellow-700",
        };
      case "error":
        return { bg: "bg-red-100", badge: "bg-red-500", text: "text-red-700" };
      case "info":
      default:
        return {
          bg: "bg-blue-100",
          badge: "bg-blue-500",
          text: "text-blue-700",
        };
    }
  };

  /**
   * Validate if URL is valid and safe
   */
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      // Accept relative paths like /logo.png or logo.png
      return url.startsWith("/") || !url.includes(":");
    }
  };

  /**
   * Get display element: image > icon > default emoji
   * Backend handles image selection (user photo, logo, or app logo)
   */
  const getDisplayElement = (
    payload: InAppNotificationPayload | Record<string, any>,
  ) => {
    if (!payload) {
      return { type: "emoji", value: "📌" };
    }

    const inAppPayload = payload as InAppNotificationPayload;

    // Use image field if available and valid
    if (isValidImageUrl(inAppPayload.image)) {
      return { type: "image", value: inAppPayload.image };
    }

    // Fall back to icon mapping
    const iconName = inAppPayload.icon?.toLowerCase() || "";
    const iconMap: Record<string, string> = {
      "check-circle": "✓",
      "user-check": "✓",
      calendar: "📅",
      "x-circle": "✕",
      "alert-triangle": "⚠",
      clock: "🕐",
      wallet: "💰",
      message: "💬",
      user: "👤",
      star: "⭐",
      heart: "❤️",
    };

    return { type: "emoji", value: iconMap[iconName] || "📌" };
  };

  /**
   * Format notification for display
   */
  const formatNotification = (notification: (typeof notifications)[0]) => {
    const payload = notification.payload as
      | InAppNotificationPayload
      | Record<string, any>;
    const title = (payload.title as string) || "Notification";
    const message = (payload.message as string) || "";
    const payloadType = (payload as InAppNotificationPayload).type || "info";
    const timestamp = formatDistanceToNow(new Date(notification.createdAt), {
      addSuffix: true,
    });
    const isUnread = !notification.readAt;
    const action = (payload as InAppNotificationPayload).action;
    const metadata = (payload as InAppNotificationPayload).metadata;

    return {
      id: notification.id,
      title,
      message,
      timestamp,
      isUnread,
      type: notification.type,
      deliveryStatus: notification.deliveryStatus,
      payloadType,
      action,
      metadata,
      display: getDisplayElement(payload),
    };
  };

  const handleNotificationClick = async (
    notificationId: string,
    action?: InAppNotificationPayload["action"],
    metadata?: Record<string, any>,
    isActionButton: boolean = false,
  ) => {
    await markAsRead(notificationId);

    if (action?.route) {
      router.push(action.route);
    } else if (action?.actionType === "respond_invitation" && metadata?.relatedId) {
      // For invitation responses, navigate to opportunity details with applicationId
      const opportunityId = metadata.relatedId;
      const applicationId = action.id;
      router.push(`/opportunities/${opportunityId}?appId=${applicationId}`);
    }
    
    // Close modal after marking as read and initiating navigation
    if (isActionButton) {
      onActionClick?.();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-styled">
      {allNotifications.map((notification) => {
        const formatted = formatNotification(notification);
        const colors = getTypeColors(formatted.payloadType);

        return (
          <div
            key={notification.id}
            className={`flex gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              formatted.isUnread ? colors.bg : ""
            }`}
            onClick={(e) => {
              // Don't handle click if it's from an action button
              const target = e.target as HTMLElement;
              if (target.closest("button")) {
                return;
              }
              handleNotificationClick(notification.id, formatted.action, formatted.metadata, true)
            }}
            role="button"
            tabIndex={0}
          >
            {/* Avatar with image or emoji */}
            {formatted.display.type === "image" ? (
              <img
                src={formatted.display.value}
                alt={formatted.title}
                className="flex-shrink-0 w-11 h-11 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const imgElement = e.currentTarget;
                  imgElement.style.display = "none";
                  const parent = imgElement.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg ${colors.badge}">📌</div>`;
                  }
                }}
              />
            ) : (
              <div
                className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg ${colors.badge}`}
              >
                {formatted.display.value}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-[12px] leading-snug">
                <span className="font-semibold text-gray-900">
                  {formatted.title}
                </span>{" "}
                <span className="font-normal text-gray-700">
                  {formatted.message}
                </span>
              </p>

              <div className="flex flex-col gap-0.5 mt-1.5">
                <div className="flex items-center gap-1.5">
                  {formatted.isUnread && (
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.badge}`}
                    ></div>
                  )}
                  <p className="text-[10px] text-gray-500">
                    {formatted.timestamp}
                  </p>
                  {formatted.deliveryStatus === "failed" && (
                    <span className="text-[9px] text-red-500 ml-auto">
                      Failed
                    </span>
                  )}
                </div>

                {/* Action button */}
                {formatted.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleNotificationClick(
                        notification.id,
                        formatted.action,
                        formatted.metadata,
                        true,
                      );
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5 mt-1"
                  >
                    {formatted.action.label} →
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
