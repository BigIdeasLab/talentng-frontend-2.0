"use client";

import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { SwipeableModal } from "@/components/ui/SwipeableModal";
import type {
  Notification,
  InAppNotificationPayload,
} from "@/lib/types/notification";

interface NotificationDetailPanelProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: (action: any) => void;
  isMobile: boolean;
}

export function NotificationDetailPanel({
  notification,
  isOpen,
  onClose,
  onActionClick,
  isMobile,
}: NotificationDetailPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Focus management: move focus to close button when panel opens
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element before moving focus
      previouslyFocusedElementRef.current =
        document.activeElement as HTMLElement;

      // Move focus to the close button
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Focus restoration: return focus to previously focused element on close
  useEffect(() => {
    return () => {
      if (!isOpen && previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isOpen]);

  // Keyboard event handler for Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !notification) return null;

  // Extract payload data
  const payload = notification.payload as
    | InAppNotificationPayload
    | Record<string, any>;
  const title = payload.title as string;
  const message = payload.message as string;
  const payloadType = (payload as InAppNotificationPayload).type || "info";
  const timestamp = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });
  const action = (payload as InAppNotificationPayload).action;
  const metadata = (payload as InAppNotificationPayload).metadata;

  // Utility functions
  const getTypeColors = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-100",
          badge: "bg-green-500",
          text: "text-green-700",
          icon: "✓",
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          badge: "bg-yellow-500",
          text: "text-yellow-700",
          icon: "⚠",
        };
      case "error":
        return {
          bg: "bg-red-100",
          badge: "bg-red-500",
          text: "text-red-700",
          icon: "✕",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-100",
          badge: "bg-blue-500",
          text: "text-blue-700",
          icon: "ℹ",
        };
    }
  };

  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return url.startsWith("/") || !url.includes(":");
    }
  };

  const getDisplayElement = (
    payload: InAppNotificationPayload | Record<string, any>,
  ) => {
    if (!payload) {
      return { type: "emoji", value: "📌" };
    }

    const inAppPayload = payload as InAppNotificationPayload;

    if (isValidImageUrl(inAppPayload.image)) {
      return { type: "image", value: inAppPayload.image };
    }

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

  const colors = getTypeColors(payloadType);
  const displayElement = getDisplayElement(payload);

  const handleActionButtonClick = () => {
    if (action && onActionClick) {
      onActionClick(action);
    }
  };

  return (
    <SwipeableModal
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
      swipeEnabled={true}
      className="animate-slide-in-right"
    >
      {/* Header with close button */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
        <h3
          id="detail-panel-title"
          className="text-[17px] font-semibold text-gray-900"
        >
          Notification Details
        </h3>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          aria-label="Close detail panel"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 bg-white">
        {/* Type indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-2 h-2 rounded-full ${colors.badge} transition-colors`}
          />
          <span
            className={`text-sm font-medium ${colors.text} capitalize transition-colors`}
          >
            {payloadType}
          </span>
        </div>

        {/* Image/Icon display */}
        {displayElement.type === "image" && displayElement.value ? (
          <div className="mb-4">
            <Image
              src={displayElement.value}
              alt={title}
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg object-cover transition-opacity duration-200"
              sizes="64px"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="mb-4">
            <div className="w-16 h-16 flex items-center justify-center text-4xl transition-transform hover:scale-110">
              {displayElement.value}
            </div>
          </div>
        )}

        {/* Title */}
        <h4 className="text-lg font-semibold text-gray-900 mb-3">{title}</h4>

        {/* Message */}
        <p className="text-[15px] text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
          {message}
        </p>

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <span>🕐</span>
          <span>{timestamp}</span>
        </div>

        {/* Action button */}
        {action && (
          <button
            onClick={handleActionButtonClick}
            className={`w-full px-4 py-3 text-sm font-medium text-white ${colors.badge} hover:opacity-90 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close button at bottom */}
      <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Close
        </button>
      </div>
    </SwipeableModal>
  );
}
