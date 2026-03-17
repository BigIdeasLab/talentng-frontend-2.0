"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { TalentNotifications } from "@/components/talent/notification/TalentNotifications";
import { EmployerNotifications } from "@/components/employer/notification/EmployerNotifications";
import { MentorNotifications } from "@/components/mentor/notification/MentorNotifications";
import { useNotifications } from "@/hooks/useNotifications";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NotificationDetailPanel } from "@/components/layouts/modals/NotificationDetailPanel";
import type { NotificationAction } from "@/lib/types/notification";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead?: () => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
  onNotificationRead,
}: NotificationsModalProps) {
  const { activeRole } = useProfile();
  const router = useRouter();

  // Get notifications based on role
  const { markAsRead, notifications: roleNotifications } = useNotifications(
    (activeRole || "talent") as "talent" | "recruiter" | "mentor" | "general",
  );
  const { notifications: generalNotifications } = useNotifications("general");

  // Combine notifications for mentor (who uses both mentor and general)
  const allNotifications =
    activeRole === "mentor"
      ? [
          ...roleNotifications,
          ...generalNotifications.filter(
            (gn) => !roleNotifications.some((rn) => rn.id === gn.id),
          ),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
      : roleNotifications;

  const isMobile = useIsMobile();

  // State management for selected notification
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  /**
   * Handle notification deletion while viewing
   * Automatically close detail panel when selected notification is removed from list
   */
  useEffect(() => {
    if (selectedNotificationId) {
      const notificationExists = allNotifications.some(
        (n) => n.id === selectedNotificationId,
      );
      if (!notificationExists) {
        setSelectedNotificationId(null);
      }
    }
  }, [allNotifications, selectedNotificationId]);

  /**
   * Handle notification selection
   * Marks notification as read, sets selectedNotificationId, calls onNotificationRead callback
   */
  const handleNotificationSelect = async (notificationId: string) => {
    await markAsRead(notificationId);
    setSelectedNotificationId(notificationId);
    onNotificationRead?.();
  };

  /**
   * Handle detail panel close
   * Clears selectedNotificationId
   */
  const handleDetailPanelClose = () => {
    setSelectedNotificationId(null);
  };

  /**
   * Handle notification dismissal via swipe
   */
  const handleNotificationDismiss = async (notificationId: string) => {
    try {
      // TODO: Implement delete notification functionality
      console.log("Dismissing notification:", notificationId);
      // If the dismissed notification was selected, close the detail panel
      if (selectedNotificationId === notificationId) {
        setSelectedNotificationId(null);
      }
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  };
  /**
   * Handle action click
   * Executes action (navigation), closes both panels
   */
  const handleActionClick = (action?: NotificationAction) => {
    if (action?.route) {
      router.push(action.route);
    }
    setSelectedNotificationId(null);
    onClose();
  };

  if (!isOpen) return null;

  // Find the selected notification from the combined notifications list
  const selectedNotification = selectedNotificationId
    ? allNotifications.find((n) => n.id === selectedNotificationId) || null
    : null;

  const renderNotifications = () => {
    switch (activeRole) {
      case "recruiter":
        return (
          <EmployerNotifications
            onActionClick={handleActionClick}
            onNotificationRead={onNotificationRead}
            onNotificationSelect={handleNotificationSelect}
            selectedNotificationId={selectedNotificationId}
            onNotificationDismiss={handleNotificationDismiss}
          />
        );
      case "mentor":
        return (
          <MentorNotifications
            onActionClick={handleActionClick}
            onNotificationRead={onNotificationRead}
            onNotificationSelect={handleNotificationSelect}
            selectedNotificationId={selectedNotificationId}
            onNotificationDismiss={handleNotificationDismiss}
          />
        );
      case "talent":
      default:
        return (
          <TalentNotifications
            onActionClick={handleActionClick}
            onNotificationRead={onNotificationRead}
            onNotificationSelect={handleNotificationSelect}
            selectedNotificationId={selectedNotificationId}
            onNotificationDismiss={handleNotificationDismiss}
          />
        );
    }
  };

  /**
   * Handle backdrop click
   * Closes both detail panel and notification modal
   */
  const handleBackdropClick = () => {
    handleDetailPanelClose();
    onClose();
  };

  return (
    <>
      {/* Backdrop - closes both panels when clicked */}
      <div className="fixed inset-0 z-40" onClick={handleBackdropClick} />

      {/* Modal - Full screen on mobile, sidebar on desktop */}
      <div className="fixed inset-0 md:left-[250px] md:top-0 md:bottom-0 md:w-[350px] md:inset-auto z-50">
        <div
          className="w-full h-full flex flex-col overflow-hidden shadow-lg"
          style={{ backgroundColor: "#FFFFFF" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-lg md:text-[17px] font-semibold text-gray-900">
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
              aria-label="Close notifications"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto scrollbar-styled">
            {renderNotifications()}
          </div>
        </div>
      </div>

      {/* NotificationDetailPanel - conditionally rendered based on selectedNotificationId */}
      {selectedNotificationId && (
        <NotificationDetailPanel
          notification={selectedNotification}
          isOpen={!!selectedNotificationId}
          onClose={handleDetailPanelClose}
          onActionClick={handleActionClick}
          isMobile={isMobile ?? false}
        />
      )}
    </>
  );
}
