"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useProfileData } from "@/hooks/useProfileData";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { TalentSidebar } from "@/components/layouts/sidebars/TalentSidebar";
import { RecruiterSidebar } from "@/components/layouts/sidebars/RecruiterSidebar";
import { MentorSidebar } from "@/components/layouts/sidebars/MentorSidebar";
import { MobileSidebar } from "@/components/talent/profile/components/MobileSidebar";
import { LoadingScreen } from "@/components/layouts/LoadingScreen";
import { NotificationsModal } from "@/components/layouts/modals/NotificationsModal";

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const { activeRole, isLoading } = useProfile();

  // Map active role to recipient role for notifications
  const getRecipientRole = (
    role: string | null,
  ): "talent" | "recruiter" | "general" => {
    if (role === "recruiter") return "recruiter";
    if (role === "talent" || role === "mentor") return "talent";
    return "general";
  };

  // Fetch role-specific notifications
  const {
    unreadCount: roleUnreadCount,
    refreshNotifications: refreshRoleNotifications,
  } = useNotifications(activeRole ? getRecipientRole(activeRole) : undefined);

  // Fetch general notifications
  const {
    unreadCount: generalUnreadCount,
    refreshNotifications: refreshGeneralNotifications,
  } = useNotifications("general");

  // Subscribe to role-specific notification updates
  useNotificationSocket({
    recipientRole: activeRole ? getRecipientRole(activeRole) : "talent",
    onCountUpdate: (unread) => {
      // Update state when count changes
      setTotalUnreadCount(() => unread);
    },
    onNotificationCreated: () => {
      // Refresh notifications when new one arrives
      refreshRoleNotifications();
      refreshGeneralNotifications();
    },
    onNotificationRead: () => {
      // Refresh notifications when one is marked as read
      refreshRoleNotifications();
      refreshGeneralNotifications();
    },
    enabled: !!activeRole,
  });

  // Combine counts for sidebar display
  useEffect(() => {
    setTotalUnreadCount(roleUnreadCount + generalUnreadCount);
  }, [roleUnreadCount, generalUnreadCount]);

  // Redirect to onboarding if no active role after loading
  useEffect(() => {
    if (!isLoading && !activeRole) {
      router.replace("/onboarding");
    }
  }, [isLoading, activeRole, router]);

  // Fetch profile data client-side
  useProfileData();

  // Select sidebar based on active role
  const renderSidebar = () => {
    if (!activeRole) return null;

    switch (activeRole) {
      case "recruiter":
        return (
          <RecruiterSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            notificationCount={totalUnreadCount}
          />
        );
      case "mentor":
        return (
          <MentorSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            notificationCount={totalUnreadCount}
          />
        );
      case "talent":
      default:
        return (
          <TalentSidebar
            activeItem={activeNavItem}
            onItemSelect={setActiveNavItem}
            onNotificationClick={() => setIsNotificationsOpen(true)}
            notificationCount={totalUnreadCount}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-white flex-col md:flex-row">
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E1E4EA]">
        <div className="font-medium text-[18px] text-black font-inter-tight">
          TalentNG
        </div>
        <MobileSidebar
          activeItem={activeNavItem}
          onItemSelect={setActiveNavItem}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {renderSidebar()}
      </div>

      {/* Children Content */}
      <div className="flex-1 overflow-y-auto scrollbar-styled">
        {isLoading || !activeRole ? <LoadingScreen /> : children}
      </div>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
